import { WalletApi } from '@api/wallet.api';
import { HttpClient } from '@utils/http-client';
import logger from 'loglevel';
import {
  IExecRecoveryRequest,
  IWalletAPI,
  IWalletNotifications,
  WalletFormats,
  WalletTypes,
} from '@models/wallet.models';
import { SUPPORTED_CHAINS } from '@models/common.models';
import { v4 as uuidv4 } from 'uuid';

jest.mock('@utils/http-client');
jest.mock('loglevel', () => ({
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

  const authentication = {
    challenge,
    attestation,
  };

  beforeEach(() => {
    httpClientMock = new HttpClient('') as jest.Mocked<HttpClient>;
    wallet = new WalletApi(new HttpClient(''));
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
        walletName,
        walletFormat: WalletFormats.ETHEREUM,
        signer: authentication,
      } as IWalletAPI;

      const response = {
        address: '1',
        name: 'wallet6',
        type: 'EOA',
        signer: {
          address: '2',
          walletId: '3',
          format: 'ethereum',
          organizationId: '4',
        },
      };

      httpClientMock.post = jest.fn().mockResolvedValue({ data: response });

      const result = await wallet.createWallet(data);

      expect(logger.debug).toHaveBeenCalledWith('WalletApi: Creating Wallet');
      expect(httpClientMock.post).toHaveBeenCalledWith('/wallets', data);
      expect(result).toEqual({
        address: '1',
        name: 'wallet6',
        type: 'EOA',
        signer: {
          address: '2',
          format: 'ethereum',
        },
      });
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
          name: 'wallet6',
          type: 'LIGHT_ACCOUNT_ABSTRACTION',
          address: '0x4F7132300EC15E2Ce820B363228B31be34cBD192',
          signer: {
            address: '0x9e96EEcc7A82A084e487073d3F15c8eaeA006CAF',
            format: 'ethereum',
          },
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
      const response = {
        organizationId: '123',
        needsApproval: false,
        fingerprint: '123',
        activityId: '123',
        signedTransaction: '0x1234',
        status: 'status',
      };
      httpClientMock.post = jest
        .fn()
        .mockResolvedValue({ data: { data: response } });

      const result = await wallet.signTransaction('address', data);
      expect(logger.debug).toHaveBeenCalledWith(
        'WalletApi: Signing transaction',
      );
      expect(httpClientMock.post).toHaveBeenCalledWith(
        '/wallets/address/sign',
        data,
      );
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

  describe('getNonce', () => {
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

      const result = await wallet.getNonce(
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

  describe('transactionHistory', () => {
    it('should throw error if getTransactionHistory fails', async () => {
      httpClientMock.get = jest.fn().mockRejectedValue(new Error('error'));

      await expect(
        wallet.getTransactionHistory(address, chainId),
      ).rejects.toThrow('error');
    });

    it('should call get on HttpClient when getTransactionHistory is called', async () => {
      const queryParams = { page: 0 };
      const response = {
        currentPage: 0,
        transactions: [
          {
            transactionId: uuidv4(),
            from: '0x4dEf358B35F169e94781EA0d3853dB5A477f92CB',
            chainId: SUPPORTED_CHAINS.ETHEREUM,
            to: '0x4dEf358B35F169e94781EA0d3853dB5A477f92CB',
            value: '1',
            gasLimit: '1',
            maxFeePerGas: '1',
            maxPriorityFeePerGas: '1',
            nonce: 1,
            data: '0x',
            fingerprint: 'fingerprint',
            organizationId: 'organizationId',
          },
        ],
      };

      httpClientMock.get = jest.fn().mockResolvedValue({ data: response });

      const result = await wallet.getTransactionHistory(address, chainId);

      expect(logger.debug).toHaveBeenCalledWith('WalletApi: Getting Wallets');
      expect(httpClientMock.get).toHaveBeenCalledWith(
        `/wallets/${address}/chains/${chainId}/transactions?page=${queryParams.page}`,
      );
      expect(result).toEqual(response);
    });

    it('should throw error if getTransactionHistory fails', async () => {
      httpClientMock.get = jest.fn().mockRejectedValue(new Error('error'));
    });
  });

  describe('getGasFees', () => {
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
      expect(httpClientMock.post).toHaveBeenCalledWith(
        `/transactions/estimate`,
        {
          chainId: request.chainId,
          raw: {
            from: request.from,
            to: request.to,
            value: request.value,
            data: request.data,
          },
        },
      );
      expect(result).toEqual(response);
    });
  });

  describe('recovery', () => {
    it('should throw error if recovery fails', async () => {
      const publicKey = 'public-key-value';

      httpClientMock.post = jest.fn().mockRejectedValue(new Error('error'));

      await expect(wallet.recover(publicKey, address)).rejects.toThrow('error');
    });

    it('should call post on HttpClient when recovery is called', async () => {
      const publicKey = 'public-key-value';

      const response = {
        data: {
          eoa: {
            organizationId: '44d9a7f9-f745-4b10-ae66-028bc2fc45c0',
            userId: 'fab988c5-62bf-4ea8-9201-dbf670c42626',
            needsApproval: false,
            fingerprint: 'fingerprint',
            activityId: 'activityId',
          },
        },
      };

      httpClientMock.post = jest.fn().mockResolvedValue({ data: response });

      const result = await wallet.recover(publicKey, address);

      expect(logger.debug).toHaveBeenCalledWith('WalletApi: Wallet Recovery');
      expect(httpClientMock.post).toHaveBeenCalledWith(
        `/wallets/${address}/recovery`,
        {
          eoa: {
            targetPublicKey: publicKey,
          },
        },
      );
      expect(result).toEqual(response.data);
    });
  });

  describe('execRecovery', () => {
    const request = {
      organizationId: '',
      userId: '',
      timestamp: '',
      authenticator: {
        authenticatorName: '',
        challenge: '',
        attestation: {
          credentialId: '',
          clientDataJson: '',
          attestationObject: '',
          transports: [''],
        },
      },
      stamped: {
        stampHeaderName: '',
        stampHeaderValue: '',
      },
    };
    it('should throw error if recovery fails', async () => {
      httpClientMock.post = jest.fn().mockRejectedValue(new Error('error'));

      await expect(
        wallet.execRecover({} as IExecRecoveryRequest),
      ).rejects.toThrow('error');
    });

    it('should call post on HttpClient when execRecovery is called', async () => {
      const response = {
        data: {
          status: 'recovered',
        },
      };

      httpClientMock.post = jest.fn().mockResolvedValue(response);

      const result = await wallet.execRecover(request);

      expect(logger.debug).toHaveBeenCalledWith(
        'WalletApi: Wallet Recovery Execute',
      );
      expect(httpClientMock.post).toHaveBeenCalledWith(
        `/wallets/recovery/execute`,
        request,
      );
      expect(result).toEqual(response.data);
    });
  });

  describe('getPortfolio', () => {
    it('should throw error if getPortfolio fails', async () => {
      httpClientMock.get = jest.fn().mockRejectedValue(new Error('error'));

      await expect(wallet.getPortfolio(address, chainId)).rejects.toThrow(
        'error',
      );
    });

    it('should call get on HttpClient when getPortfolio is called', async () => {
      const response = {
        address: address,
        chainId: SUPPORTED_CHAINS.ETHEREUM,
        portfolio: [],
      };

      httpClientMock.get = jest
        .fn()
        .mockResolvedValue({ data: { data: response } });

      const result = await wallet.getPortfolio(address, chainId);

      expect(logger.debug).toHaveBeenCalledWith(
        'WalletApi: Get Wallet Portfolio',
      );
      expect(httpClientMock.get).toHaveBeenCalledWith(
        `/wallets/portfolio/${address}/${chainId}`,
      );
      expect(result).toEqual(response);
    });
  });

  describe('getNotifications', () => {
    it('should throw error if getNotifications fails', async () => {
      httpClientMock.get = jest.fn().mockRejectedValue(new Error('error'));

      await expect(wallet.getNotifications()).rejects.toThrow('error');
    });

    it('should call get on HttpClient when getNotifications is called', async () => {
      const response: IWalletNotifications = [];

      httpClientMock.get = jest
        .fn()
        .mockResolvedValue({ data: { messages: response } });

      const result = await wallet.getNotifications();

      expect(logger.debug).toHaveBeenCalledWith(
        'WalletApi: Get Wallet Notifications',
      );
      expect(httpClientMock.get).toHaveBeenCalledWith(`/wallets/notifications`);
      expect(result).toEqual(response);
    });
  });

  describe('approveSignTransaction', () => {
    const data = {
      timestamp: 'timestamp',
      organizationId: 'organizationId',
      stamped: {
        stampHeaderName: 'stampHeaderName',
        stampHeaderValue: 'stampHeaderValue',
      },
      address: 'address',
      fingerprint: 'fingerprint',
    };

    it('should throw error if approveSignTransaction fails', async () => {
      httpClientMock.post = jest.fn().mockRejectedValue(new Error('error'));

      await expect(wallet.approveSignTransaction(data)).rejects.toThrow(
        'error',
      );
    });

    it('should call post on HttpClient when approveSignTransaction is called', async () => {
      const response = {
        organizationId: '123',
        needsApproval: false,
        fingerprint: '123',
        activityId: '123',
        signedTransaction: '0x1234',
        status: 'status',
      };
      httpClientMock.post = jest.fn().mockResolvedValue({ data: response });

      const result = await wallet.approveSignTransaction(data);
      expect(logger.debug).toHaveBeenCalledWith(
        'WalletApi: Approving transaction',
      );
      expect(httpClientMock.post).toHaveBeenCalledWith(
        `/wallets/${data.address}/sign/${data.fingerprint}/approve`,
        data,
      );
      expect(result).toEqual(response);
    });
  });

  describe('rejectSignTransaction', () => {
    const data = {
      timestamp: 'timestamp',
      organizationId: 'organizationId',
      stamped: {
        stampHeaderName: 'stampHeaderName',
        stampHeaderValue: 'stampHeaderValue',
      },
      address: 'address',
      fingerprint: 'fingerprint',
    };

    it('should throw error if rejectSignTransaction fails', async () => {
      httpClientMock.post = jest.fn().mockRejectedValue(new Error('error'));

      await expect(wallet.rejectSignTransaction(data)).rejects.toThrow('error');
    });

    it('should call post on HttpClient when rejectSignTransaction is called', async () => {
      const response = {
        organizationId: '123',
        needsApproval: false,
        fingerprint: '123',
        activityId: '123',
        signedTransaction: '0x1234',
        status: 'status',
      };
      httpClientMock.post = jest.fn().mockResolvedValue({ data: response });

      const result = await wallet.rejectSignTransaction(data);
      expect(logger.debug).toHaveBeenCalledWith(
        'WalletApi: Rejecting transaction',
      );
      expect(httpClientMock.post).toHaveBeenCalledWith(
        `/wallets/${data.address}/sign/${data.fingerprint}/reject`,
        data,
      );
      expect(result).toEqual(response);
    });
  });
});
