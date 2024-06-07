import { WalletService } from '@services/wallet.service';
import { WalletApi } from '@api/wallet.api';
import {
  WalletKeys,
  IWallet,
  IWalletAPI,
  WalletSchemaAPI,
} from '@models/wallet.models';
import { HttpClient } from '@utils/http-client';

jest.mock('@api/wallet.api');
jest.mock('@utils/http-client');
jest.mock('@utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('WalletService', () => {
  let httpClient: jest.Mocked<HttpClient>;
  let walletApi: jest.Mocked<WalletApi>;
  let walletService: WalletService;

  const challenge = 'FsAxSlgRXHR7o-ePTrRreH8gm-OZVix8V3wlSqJQ50w';

  const attestation = {
    credentialId: '_xC0tyqT8LYXQfz9hCQBTVbXS4I',
    clientDataJson:
      'eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoi' +
      'RnNBeFNsZ1JYSFI3by1lUFRyUnJlSDhnbS1PWlZpeDhWM3dsU3FKUT' +
      'UwdyIsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsImNyb3NzT3JpZ2luIjpmYWxzZX0',
    attestationObject:
      'o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YViYSZYN5YgOjGh0' +
      'NBcPZHZgW4_krrmihjLHmVzzuoMdl2NdAAAAAAAAAAAAAAAAAAAAAA' +
      'AAAAAAFP8QtLcqk_C2F0H8_YQkAU1W10uCpQECAyYgASFYIKOv0RbKM' +
      'A4DyVDI_Er_-SqUY7an5o41_8X7ugxQHwIeIlggzuElSvkH1R9SP_XRwfsk2vM0Y4Fc_UdJQpyU8lLcytM',
    transports: [
      'AUTHENTICATOR_TRANSPORT_HYBRID',
      'AUTHENTICATOR_TRANSPORT_INTERNAL',
    ],
  };

  const authenticationType = {
    challenge,
    attestation,
  };

  beforeEach(() => {
    httpClient = new HttpClient('') as jest.Mocked<HttpClient>;
    walletApi = new WalletApi(httpClient, '/wallets') as jest.Mocked<WalletApi>;

    (WalletApi as jest.Mock<WalletApi>).mockImplementation(() => walletApi);

    walletService = new WalletService(httpClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createWallet', () => {
    it('should catch if wrong data structure', async () => {
      const example: IWallet = {
        [WalletKeys.WALLET_TYPE]: 'eoa',
        [WalletKeys.WALLET_NAME]: 'name',
        [WalletKeys.WALLET_FORMAT]: 'format',
        [WalletKeys.AUTHENTICATION_TYPE]: authenticationType,
      };
      jest.spyOn(WalletSchemaAPI, 'parse').mockRejectedValue('' as never);

      await expect(walletService.createWallet(example)).rejects.toThrow(
        'Failed verify data',
      );
    });

    it('should create a new wallet', async () => {
      const example: IWallet = {
        [WalletKeys.WALLET_TYPE]: 'eoa',
        [WalletKeys.WALLET_NAME]: 'name',
        [WalletKeys.WALLET_FORMAT]: 'format',
        [WalletKeys.AUTHENTICATION_TYPE]: authenticationType,
      };
      const data = {
        walletType: {
          eoa: {
            [WalletKeys.WALLET_NAME]: 'name',
            [WalletKeys.WALLET_FORMAT]: 'format',
            [WalletKeys.AUTHENTICATION_TYPE]: authenticationType,
          },
        },
      } as IWalletAPI;

      walletApi.createWallet.mockResolvedValueOnce(example);

      const result = await walletService.createWallet(example);

      expect(walletApi.createWallet).toHaveBeenCalledWith(data);
      expect(result).toEqual(example);
    });
  });

  describe('getWallets', () => {
    it('should get wallets', async () => {
      const exampleAPI = [
        {
          name: 'testName',
          type: 'testType',
          format: 'testFormat',
          owner: 'testOwner',
          address: '0xtestAddress',
        },
      ];
      const exampleService = [
        {
          [WalletKeys.WALLET_NAME]: 'testName',
          [WalletKeys.WALLET_TYPE]: 'testType',
          [WalletKeys.WALLET_FORMAT]: 'testFormat',
          [WalletKeys.WALLET_OWNER]: 'testOwner',
          [WalletKeys.WALLET_ADDRESS]: '0xtestAddress',
        },
      ];

      walletApi.getWallets.mockResolvedValueOnce(exampleAPI);

      const result = await walletService.getWallets();

      expect(walletApi.getWallets).toHaveBeenCalled();
      expect(result).toEqual(exampleService);
    });
  });
});
