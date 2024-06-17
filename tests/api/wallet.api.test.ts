import { WalletApi } from '@api/wallet.api';
import { HttpClient } from '@utils/http-client';
import logger from '@utils/logger';
import { IWalletAPI, WalletFormats, WalletTypes } from '@models/wallet.models';
import { SUPPORTED_CHAINS } from '@models/common.models';

jest.mock('@utils/http-client');
jest.mock('@utils/logger', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
}));

describe('Wallet', () => {
  let wallet: WalletApi;
  let httpClientMock: jest.Mocked<HttpClient>;

  const walletName = 'Test wallet';
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
    httpClientMock = new HttpClient('') as jest.Mocked<HttpClient>;
    wallet = new WalletApi();
    // eslint-disable-next-line
    (wallet as any).httpClient = httpClientMock;
  });

  describe('createWallet', () => {
    it('should throw error if createWallet fails', async () => {
      httpClientMock.post = jest.fn().mockRejectedValue(new Error('error'));

      await expect(wallet.createWallet({} as IWalletAPI)).rejects.toThrow(
        'error',
      );
    });

    it('should call post on HttpClient when createWallet is called', async () => {
      const data = {
        walletType: {
          [WalletTypes.EOA]: {
            walletName,
            walletFormat: WalletFormats.ETHEREUM,
            authenticationType,
          },
        },
      } as IWalletAPI;

      const response = {
        [WalletTypes.EOA]: {
          walletName: '1',
          walletFormat: WalletFormats.ETHEREUM,
          walletType: WalletTypes.EOA,
          walletAddress: '4',
        },
      };

      httpClientMock.post = jest.fn().mockResolvedValue({ data: response });

      const result = await wallet.createWallet(data);

      expect(logger.debug).toHaveBeenCalledWith('WalletApi: Creating Wallet');
      expect(httpClientMock.post).toHaveBeenCalledWith('/wallets', data);
      expect(result).toEqual(response);
    });
  });

  describe('getWallets', () => {
    it('should throw error if getWallets fails', async () => {
      httpClientMock.get = jest.fn().mockRejectedValue(new Error('error'));

      await expect(wallet.getWallets()).rejects.toThrow('error');
    });

    it('should call get on HttpClient when getWallets is called', async () => {
      const response = [
        {
          name: 'name',
          type: WalletTypes.EOA,
          format: WalletFormats.ETHEREUM,
          owner: 'owner',
          address: 'address',
        },
      ];

      httpClientMock.get = jest.fn().mockResolvedValue({ data: response });

      const result = await wallet.getWallets();

      expect(logger.debug).toHaveBeenCalledWith('WalletApi: Getting Wallets');
      expect(httpClientMock.get).toHaveBeenCalledWith('/wallets');
      expect(result).toEqual(response);
    });
  });

  describe('signTransaction', () => {
    const data = {
      walletType: WalletTypes.EOA,
      walletFormat: WalletFormats.ETHEREUM,
      unsignedTransaction: '02ea',
    };

    it('should throw error if signTransaction fails', async () => {
      httpClientMock.post = jest.fn().mockRejectedValue(new Error('error'));

      await expect(wallet.signTransaction('address', data)).rejects.toThrow(
        'error',
      );
    });

    it('should call post on HttpClient when signTransaction is called', async () => {
      httpClientMock.post = jest
        .fn()
        .mockResolvedValue({ data: { signedTransaction: '0x1234' } });

      const result = await wallet.signTransaction('address', data);

      expect(logger.debug).toHaveBeenCalledWith(
        'WalletApi: Signing transaction',
      );
      expect(httpClientMock.post).toHaveBeenCalledWith(
        '/wallets/address/sign',
        data,
      );
      expect(result).toEqual({ signedTransaction: '0x1234' });
    });
  });

  it('should throw error if getWalletNonce fails', async () => {
    httpClientMock.get = jest
      .fn()
      .mockRejectedValue(new Error('Failed to get wallet nonce'));

    await expect(
      wallet.getWalletNonce('address', SUPPORTED_CHAINS.ETHEREUM),
    ).rejects.toThrow('Failed to get wallet nonce');
  });

  it('should call get on HttpClient when getWalletNonce is called', async () => {
    const response = {
      nonce: 1,
    };

    httpClientMock.get = jest.fn().mockResolvedValue({ data: response });

    const result = await wallet.getWalletNonce(
      'address',
      SUPPORTED_CHAINS.ETHEREUM,
    );

    expect(logger.info).toHaveBeenCalledWith('Getting wallet nonce');
    expect(httpClientMock.get).toHaveBeenCalledWith(
      `/wallets/address/chains/${SUPPORTED_CHAINS.ETHEREUM}/nonce`,
    );
    expect(result).toEqual(response);
  });
});
