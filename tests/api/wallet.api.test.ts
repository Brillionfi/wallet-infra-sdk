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

  const address = '0x4dEf358B35F169e94781EA0d3853dB5A477f92CB';
  const chainId = SUPPORTED_CHAINS.ETHEREUM;

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

  describe('getGasConfig', () => {
    it('should throw error if getGasConfig fails', async () => {
      httpClientMock.get = jest
        .fn()
        .mockRejectedValue(new Error('Failed to get wallet nonce'));

      await expect(wallet.getGasConfig(address, chainId)).rejects.toThrow(
        'Failed to get wallet nonce',
      );
    });

    it('should call get on HttpClient when getGasConfig is called', async () => {
      const response = {
        gasLimit: '1',
        maxFeePerGas: '1',
        maxPriorityFeePerGas: '1',
      };

      httpClientMock.get = jest.fn().mockResolvedValue({ data: response });

      const result = await wallet.getGasConfig(address, chainId);

      expect(logger.debug).toHaveBeenCalledWith(
        'WalletApi: Getting wallet gas configuration',
      );
      expect(httpClientMock.get).toHaveBeenCalledWith(
        `/wallets/${address}/chains/${chainId}/gas-station`,
      );
      expect(result).toEqual(response);
    });
  });

  describe('createGasConfig', () => {
    const gasData = {
      gasLimit: '1',
      maxFeePerGas: '1',
      maxPriorityFeePerGas: '1',
    };

    it('should throw error if createGasConfig fails', async () => {
      httpClientMock.post = jest.fn().mockRejectedValue(new Error('error'));

      await expect(
        wallet.createGasConfig(address, chainId, gasData),
      ).rejects.toThrow('error');
    });

    it('should call post on HttpClient when createGasConfig is called', async () => {
      httpClientMock.post = jest
        .fn()
        .mockResolvedValue({ data: { status: 'Successfully created' } });

      const result = await wallet.createGasConfig(address, chainId, gasData);

      expect(logger.debug).toHaveBeenCalledWith(
        'WalletApi: Setting wallet gas configuration',
      );
      expect(httpClientMock.post).toHaveBeenCalledWith(
        `/wallets/${address}/chains/${chainId}/gas-station`,
        gasData,
      );
      expect(result).toEqual({ status: 'Successfully created' });
    });
  });

  describe('updateGasConfig', () => {
    const gasData = {
      gasLimit: '1',
      maxFeePerGas: '1',
      maxPriorityFeePerGas: '1',
    };

    it('should throw error if updateGasConfig fails', async () => {
      httpClientMock.patch = jest.fn().mockRejectedValue(new Error('error'));

      await expect(
        wallet.updateGasConfig(address, chainId, gasData),
      ).rejects.toThrow('error');
    });

    it('should call patch on HttpClient when updateGasConfig is called', async () => {
      httpClientMock.patch = jest
        .fn()
        .mockResolvedValue({ data: { status: 'Successfully updated' } });

      const result = await wallet.updateGasConfig(address, chainId, gasData);

      expect(logger.debug).toHaveBeenCalledWith(
        'WalletApi: Updating wallet gas configuration',
      );
      expect(httpClientMock.patch).toHaveBeenCalledWith(
        `/wallets/${address}/chains/${chainId}/gas-station`,
        gasData,
      );
      expect(result).toEqual({ status: 'Successfully updated' });
    });
  });

  describe('deleteGasConfig', () => {
    it('should throw error if deleteGasConfig fails', async () => {
      httpClientMock.delete = jest.fn().mockRejectedValue(new Error('error'));

      await expect(wallet.deleteGasConfig(address, chainId)).rejects.toThrow(
        'error',
      );
    });

    it('should call delete on HttpClient when deleteGasConfig is called', async () => {
      httpClientMock.delete = jest
        .fn()
        .mockResolvedValue({ data: { status: 'Successfully updated' } });

      const result = await wallet.deleteGasConfig(address, chainId);

      expect(logger.debug).toHaveBeenCalledWith(
        'WalletApi: Deleting wallet gas configuration',
      );
      expect(httpClientMock.delete).toHaveBeenCalledWith(
        `/wallets/${address}/chains/${chainId}/gas-station`,
      );
      expect(result).toEqual({ status: 'Successfully updated' });
    });
  });

  it('should throw error if getNonce fails', async () => {
    httpClientMock.get = jest
      .fn()
      .mockRejectedValue(new Error('Failed to get wallet nonce'));

    await expect(
      wallet.getNonce('address', SUPPORTED_CHAINS.ETHEREUM),
    ).rejects.toThrow('Failed to get wallet nonce');
  });

  it('should call get on HttpClient when getNonce is called', async () => {
    const response = {
      nonce: 1,
    };

    httpClientMock.get = jest.fn().mockResolvedValue({ data: response });

    const result = await wallet.getNonce('address', SUPPORTED_CHAINS.ETHEREUM);

    expect(logger.info).toHaveBeenCalledWith('Getting wallet nonce');
    expect(httpClientMock.get).toHaveBeenCalledWith(
      `/wallets/address/chains/${SUPPORTED_CHAINS.ETHEREUM}/nonce`,
    );
    expect(result).toEqual(response);
  });

  it('should throw error if getGasFees fails', async () => {
    httpClientMock.post = jest
      .fn()
      .mockRejectedValue(new Error('Estimation failed'));

    await expect(
      wallet.getGasFees({
        from: 'address',
        chainId: SUPPORTED_CHAINS.ETHEREUM,
        to: 'to',
        data: '',
        value: '',
      }),
    ).rejects.toThrow('Estimation failed');
  });

  it('should call post on HttpClient when getGasFees is called', async () => {
    const response = {
      gasLimit: 'string',
      gasFee: 'string',
      maxGasFee: 'string',
      gasPrice: 'string',
      maxFeePerGas: 'string',
      maxPriorityFeePerGas: 'string',
      totalCostString: 'string',
      totalMaxCostString: 'string',
    };

    httpClientMock.post = jest.fn().mockResolvedValue({ data: response });

    const request = {
      from: 'address',
      chainId: SUPPORTED_CHAINS.ETHEREUM,
      to: 'to',
      data: '',
      value: '',
    };

    const result = await wallet.getGasFees(request);

    expect(logger.info).toHaveBeenCalledWith(
      'WalletApi: Getting transaction gas estimation',
    );
    expect(httpClientMock.post).toHaveBeenCalledWith(`/transactions/estimate`, {
      chainId: request.chainId,
      raw: {
        from: request.from,
        to: request.to,
        value: request.value,
        data: request.data,
      },
    });
    expect(result).toEqual(response);
  });

  it('should throw error if getTransactionHistory fails', async () => {
    httpClientMock.get = jest.fn().mockRejectedValue(new Error('error'));

    await expect(
      wallet.getTransactionHistory(address, chainId),
    ).rejects.toThrow('error');
  });

  it('should call get on HttpClient when getTransactionHistory is called', async () => {
    const response = [
      {
        transactionId: 'id',
        transactionHash: 'hash',
        address: '0x4dEf358B35F169e94781EA0d3853dB5A477f92CB',
        chainId: SUPPORTED_CHAINS.ETHEREUM,
        walletAddress: '0x4dEf358B35F169e94781EA0d3853dB5A477f92CB',
        createdAt: '123456',
        updatedAt: '123456',
        updatedBy: '123456',
      },
    ];

    httpClientMock.get = jest.fn().mockResolvedValue({ data: response });

    const result = await wallet.getTransactionHistory(address, chainId);

    expect(logger.debug).toHaveBeenCalledWith('WalletApi: Getting Wallets');
    expect(httpClientMock.get).toHaveBeenCalledWith(
      `wallets/${address}/chains/${chainId}/transactions`,
    );
    expect(result).toEqual(response);
  });
});
