import { WalletService } from '@services/wallet.service';
import { WalletApi } from '@api/wallet.api';
import {
  WalletKeys,
  IWallet,
  IWalletAPI,
  IWalletResponse,
  WalletTypes,
  WalletFormats,
  WalletSchemaAPI,
} from '@models/wallet.models';
import { SUPPORTED_CHAINS } from '@models/common.models';
import { CustomError } from '@utils/errors';

jest.mock('@api/wallet.api');
jest.mock('@utils/http-client');
jest.mock('@utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('WalletService', () => {
  let walletApi: jest.Mocked<WalletApi>;
  let walletService: WalletService;

  const wallet = '0xe6d0c561728eFeA5EEFbCdF0A5d0C945e3697bEA';
  const chainId = SUPPORTED_CHAINS.ETHEREUM;
  const gasData = {
    gasLimit: '1',
    maxFeePerGas: '1',
    maxPriorityFeePerGas: '1',
  };

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
    walletApi = new WalletApi() as jest.Mocked<WalletApi>;

    (WalletApi as jest.Mock<WalletApi>).mockImplementation(() => walletApi);

    walletService = new WalletService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createWallet', () => {
    it('should create a new wallet', async () => {
      const example: IWallet = {
        [WalletKeys.TYPE]: WalletTypes.EOA,
        [WalletKeys.NAME]: 'name',
        [WalletKeys.FORMAT]: WalletFormats.ETHEREUM,
        [WalletKeys.AUTHENTICATION_TYPE]: authenticationType,
      };

      const data = {
        walletType: {
          [WalletTypes.EOA.toLowerCase()]: {
            walletName: 'name',
            walletFormat: WalletFormats.ETHEREUM,
            [WalletKeys.AUTHENTICATION_TYPE]: authenticationType,
          },
        },
      } as IWalletAPI;

      const response = {
        eoa: {
          walletAddress: 'walletAddress',
          walletFormat: WalletFormats.ETHEREUM,
          walletType: WalletTypes.EOA,
          walletName: 'name',
          authenticationType: authenticationType,
        },
      };

      walletApi.createWallet = jest.fn().mockResolvedValue(response);

      const result = await walletService.createWallet(example);

      expect(walletApi.createWallet).toHaveBeenCalledWith(data);
      expect(result).toEqual({
        [WalletKeys.TYPE]: WalletTypes.EOA,
        [WalletKeys.ADDRESS]: 'walletAddress',
        [WalletKeys.FORMAT]: WalletFormats.ETHEREUM,
        [WalletKeys.NAME]: 'name',
        [WalletKeys.AUTHENTICATION_TYPE]: authenticationType,
      });
    });

    it('should throw an error when parsing data fails', async () => {
      const example: IWallet = {
        [WalletKeys.TYPE]: WalletTypes.EOA,
        [WalletKeys.NAME]: 'name',
        [WalletKeys.FORMAT]: WalletFormats.ETHEREUM,
        [WalletKeys.AUTHENTICATION_TYPE]: authenticationType,
      };

      jest.spyOn(WalletSchemaAPI, 'parse').mockImplementation(() => {
        throw new Error('Failed to parse create wallet data');
      });

      await expect(walletService.createWallet(example)).rejects.toThrow(
        'Failed to parse create wallet data',
      );
    });

    it('should throw an error when createWallet fails', async () => {
      const example: IWallet = {
        [WalletKeys.TYPE]: WalletTypes.EOA,
        [WalletKeys.NAME]: 'name',
        [WalletKeys.FORMAT]: WalletFormats.ETHEREUM,
        [WalletKeys.AUTHENTICATION_TYPE]: authenticationType,
      };

      const error = new Error('Failed to create wallet');
      walletApi.createWallet.mockRejectedValueOnce(error);

      await expect(walletService.createWallet(example)).rejects.toThrow(error);
      expect(walletApi.createWallet).toHaveBeenCalled();
    });

    it('should throw a custom error when parseCreateWalletResponse fails', async () => {
      const example: IWallet = {
        [WalletKeys.TYPE]: WalletTypes.EOA,
        [WalletKeys.NAME]: 'name',
        [WalletKeys.FORMAT]: WalletFormats.ETHEREUM,
        [WalletKeys.AUTHENTICATION_TYPE]: authenticationType,
      };

      const invalidResponse = {} as IWalletResponse;
      walletApi.createWallet.mockResolvedValue(invalidResponse);

      await expect(walletService.createWallet(example)).rejects.toThrow(
        CustomError,
      );
      expect(walletApi.createWallet).toHaveBeenCalled();
    });
  });

  describe('getWallets', () => {
    it('should get wallets', async () => {
      const exampleAPI = [
        {
          name: 'testName',
          type: WalletTypes.EOA,
          format: WalletFormats.ETHEREUM,
          owner: 'testOwner',
          address: '0xtestAddress',
        },
      ];
      const exampleService = [
        {
          [WalletKeys.NAME]: 'testName',
          [WalletKeys.TYPE]: WalletTypes.EOA,
          [WalletKeys.FORMAT]: WalletFormats.ETHEREUM,
          [WalletKeys.OWNER]: 'testOwner',
          [WalletKeys.ADDRESS]: '0xtestAddress',
        },
      ];

      walletApi.getWallets.mockResolvedValueOnce(exampleAPI);

      const result = await walletService.getWallets();

      expect(walletApi.getWallets).toHaveBeenCalled();
      expect(result).toEqual(exampleService);
    });
  });

  it('should throw an error when walletApi.getWallets fails', async () => {
    const error = new Error('Failed to fetch wallets');
    walletApi.getWallets.mockRejectedValueOnce(error);

    await expect(walletService.getWallets()).rejects.toThrow(error);
    expect(walletApi.getWallets).toHaveBeenCalled();
  });

  describe('getGasConfiguration', () => {
    it('should catch if wrong response from api', async () => {
      walletApi.getGasConfiguration.mockRejectedValue('Failed verify data');
      await expect(
        walletService.getGasConfiguration(wallet, chainId),
      ).rejects.toThrow('Failed verify data');
    });

    it('should get wallet gas configuration', async () => {
      walletApi.getGasConfiguration.mockResolvedValueOnce(gasData);

      const result = await walletService.getGasConfiguration(wallet, chainId);

      expect(walletApi.getGasConfiguration).toHaveBeenCalled();
      expect(result).toEqual(gasData);
    });
  });

  describe('setGasConfiguration', () => {
    const emptyGasData = {
      gasLimit: '',
      maxFeePerGas: '',
      maxPriorityFeePerGas: '',
    };

    it('should catch if wrong response from api', async () => {
      walletApi.getGasConfiguration.mockResolvedValueOnce(emptyGasData);
      walletApi.setGasConfiguration.mockRejectedValue('Failed verify data');
      await expect(
        walletService.setGasConfiguration(wallet, chainId, gasData),
      ).rejects.toThrow('Failed verify data');
    });

    it('should set wallet gas configuration', async () => {
      const response = { status: 'success' };
      walletApi.getGasConfiguration.mockResolvedValueOnce(emptyGasData);
      walletApi.setGasConfiguration.mockResolvedValueOnce(response);

      const result = await walletService.setGasConfiguration(
        wallet,
        chainId,
        gasData,
      );

      expect(walletApi.setGasConfiguration).toHaveBeenCalled();
      expect(result).toEqual(response);
    });
  });

  describe('updateGasConfiguration', () => {
    it('should catch if wrong response from api', async () => {
      walletApi.getGasConfiguration.mockResolvedValueOnce(gasData);
      walletApi.updateGasConfiguration.mockRejectedValue('Failed verify data');
      await expect(
        walletService.setGasConfiguration(wallet, chainId, gasData),
      ).rejects.toThrow('Failed verify data');
    });

    it('should update wallet gas configuration', async () => {
      const response = { status: 'updated' };
      walletApi.getGasConfiguration.mockResolvedValueOnce(gasData);
      walletApi.updateGasConfiguration.mockResolvedValueOnce(response);

      const result = await walletService.setGasConfiguration(
        wallet,
        chainId,
        gasData,
      );

      expect(walletApi.updateGasConfiguration).toHaveBeenCalled();
      expect(result).toEqual(response);
    });
  });

  describe('deleteGasConfiguration', () => {
    const deleteGasData = {
      gasLimit: '0',
      maxFeePerGas: '0',
      maxPriorityFeePerGas: '0',
    };

    it('should catch if wrong response from api', async () => {
      walletApi.deleteGasConfiguration.mockRejectedValue('Failed verify data');
      await expect(
        walletService.setGasConfiguration(wallet, chainId, deleteGasData),
      ).rejects.toThrow('Failed verify data');
    });

    it('should update wallet gas configuration', async () => {
      const response = { status: 'updated' };
      walletApi.deleteGasConfiguration.mockResolvedValueOnce(response);

      const result = await walletService.setGasConfiguration(
        wallet,
        chainId,
        deleteGasData,
      );

      expect(walletApi.deleteGasConfiguration).toHaveBeenCalled();
      expect(result).toEqual(response);
    });
  });
});
