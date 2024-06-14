import { WalletApi } from '@api/wallet.api';
import { HttpClient } from '@utils/http-client';
import logger from '@utils/logger';
import { IWalletAPI, WalletFormats, WalletTypes } from '@models/wallet.models';

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

  describe('getGasConfiguration', () => {
    it('should throw error if getGasConfiguration fails', async () => {
      httpClientMock.get = jest
        .fn()
        .mockRejectedValue(new Error('Failed to get wallet nonce'));

      await expect(wallet.getGasConfiguration('url')).rejects.toThrow(
        'Failed to get wallet nonce',
      );
    });

    it('should call get on HttpClient when getGasConfiguration is called', async () => {
      const response = {
        gasLimit: '1',
        maxFeePerGas: '1',
        maxPriorityFeePerGas: '1',
      };

      httpClientMock.get = jest.fn().mockResolvedValue({ data: response });

      const result = await wallet.getGasConfiguration('url');

      expect(logger.debug).toHaveBeenCalledWith(
        'WalletApi: Getting wallet gas configuration',
      );
      expect(httpClientMock.get).toHaveBeenCalledWith('url');
      expect(result).toEqual(response);
    });
  });

  describe('setGasConfiguration', () => {
    const gasData = {
      gasLimit: '1',
      maxFeePerGas: '1',
      maxPriorityFeePerGas: '1',
    };

    it('should throw error if setGasConfiguration fails', async () => {
      httpClientMock.post = jest.fn().mockRejectedValue(new Error('error'));

      await expect(wallet.setGasConfiguration('url', gasData)).rejects.toThrow(
        'error',
      );
    });

    it('should call post on HttpClient when setGasConfiguration is called', async () => {
      httpClientMock.post = jest
        .fn()
        .mockResolvedValue({ data: { status: 'Successfully created' } });

      const result = await wallet.setGasConfiguration('url', gasData);

      expect(logger.debug).toHaveBeenCalledWith(
        'WalletApi: Setting wallet gas configuration',
      );
      expect(httpClientMock.post).toHaveBeenCalledWith('url', gasData);
      expect(result).toEqual({ status: 'Successfully created' });
    });
  });

  describe('updateGasConfiguration', () => {
    const gasData = {
      gasLimit: '1',
      maxFeePerGas: '1',
      maxPriorityFeePerGas: '1',
    };

    it('should throw error if updateGasConfiguration fails', async () => {
      httpClientMock.patch = jest.fn().mockRejectedValue(new Error('error'));

      await expect(
        wallet.updateGasConfiguration('url', gasData),
      ).rejects.toThrow('error');
    });

    it('should call patch on HttpClient when updateGasConfiguration is called', async () => {
      httpClientMock.patch = jest
        .fn()
        .mockResolvedValue({ data: { status: 'Successfully updated' } });

      const result = await wallet.updateGasConfiguration('url', gasData);

      expect(logger.debug).toHaveBeenCalledWith(
        'WalletApi: Updating wallet gas configuration',
      );
      expect(httpClientMock.patch).toHaveBeenCalledWith('url', gasData);
      expect(result).toEqual({ status: 'Successfully updated' });
    });
  });

  describe('deleteGasConfiguration', () => {
    it('should throw error if deleteGasConfiguration fails', async () => {
      httpClientMock.delete = jest.fn().mockRejectedValue(new Error('error'));

      await expect(wallet.deleteGasConfiguration('url')).rejects.toThrow(
        'error',
      );
    });

    it('should call delete on HttpClient when deleteGasConfiguration is called', async () => {
      httpClientMock.delete = jest
        .fn()
        .mockResolvedValue({ data: { status: 'Successfully updated' } });

      const result = await wallet.deleteGasConfiguration('url');

      expect(logger.debug).toHaveBeenCalledWith(
        'WalletApi: Deleting wallet gas configuration',
      );
      expect(httpClientMock.delete).toHaveBeenCalledWith('url');
      expect(result).toEqual({ status: 'Successfully updated' });
    });
  });
});
