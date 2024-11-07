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
  IWalletNonceAPI,
  IWalletRecovery,
  IWalletNotifications,
  WalletSignTransactionResponseSchema,
} from '@models/wallet.models';
import { SUPPORTED_CHAINS } from '@models/common.models';
import { APIError, CustomError } from '@utils/errors';
import { ZodError } from 'zod';
import { AxiosError, AxiosResponse, HttpStatusCode } from 'axios';
import { HttpClient } from '@utils/http-client';
import { v4 as uuidv4 } from 'uuid';
import logger from 'loglevel';
import { BundleStamper, WebauthnStamper } from '@utils/stampers';
import * as BundleUtils from '@utils/stampers/webAuthnStamper/webauthn-json/api';
import axios from 'axios';
import { PublicKeyCredentialWithAttestationJSON } from '@utils/stampers/webAuthnStamper/webauthn-json';

jest.mock('@api/wallet.api');
jest.mock('axios');
jest.mock('@utils/http-client');
jest.mock('loglevel', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
}));

describe('WalletService', () => {
  let walletApi: jest.Mocked<WalletApi>;
  let walletService: WalletService;
  const mockedAxios = axios as jest.Mocked<typeof axios>;

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

  const authentication = {
    challenge,
    attestation,
  };

  const apiKey = {
    publicKey: 'fakePublicKey',
  };

  beforeEach(() => {
    walletApi = new WalletApi(new HttpClient('')) as jest.Mocked<WalletApi>;

    (WalletApi as jest.Mock<WalletApi>).mockImplementation(() => walletApi);

    walletService = new WalletService(new HttpClient(''));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createWallet', () => {
    it('should create a new wallet with APIKey authentication', async () => {
      const example: IWallet = {
        [WalletKeys.TYPE]: WalletTypes.EOA,
        [WalletKeys.NAME]: 'name',
        [WalletKeys.FORMAT]: WalletFormats.ETHEREUM,
        [WalletKeys.AUTHENTICATION]: apiKey,
      };

      const data = {
        walletName: 'name',
        walletFormat: WalletFormats.ETHEREUM,
        [WalletKeys.SIGNER]: {
          authentication: apiKey,
        },
      } as IWalletAPI;

      const response = {
        address: '1',
        name: 'name',
        type: 'EOA',
        signer: {
          address: '2',
          walletId: '3',
          format: 'ethereum',
          organizationId: '4',
        },
      };

      walletApi.createWallet = jest.fn().mockResolvedValue(response);

      const result = await walletService.createWallet(example);

      expect(walletApi.createWallet).toHaveBeenCalledWith(data);
      expect(result).toEqual({
        [WalletKeys.TYPE]: WalletTypes.EOA,
        [WalletKeys.ADDRESS]: '1',
        [WalletKeys.FORMAT]: WalletFormats.ETHEREUM,
        [WalletKeys.NAME]: 'name',
        [WalletKeys.SIGNER]: '2',
      });
    });

    it('should create a new wallet with passkey authentication', async () => {
      const example: IWallet = {
        [WalletKeys.TYPE]: WalletTypes.EOA,
        [WalletKeys.NAME]: 'name',
        [WalletKeys.FORMAT]: WalletFormats.ETHEREUM,
        [WalletKeys.AUTHENTICATION]: authentication,
      };

      const data = {
        walletName: 'name',
        walletFormat: WalletFormats.ETHEREUM,
        [WalletKeys.SIGNER]: { authentication },
      } as IWalletAPI;

      const response = {
        address: '1',
        name: 'name',
        type: 'EOA',
        signer: {
          address: '2',
          walletId: '3',
          format: 'ethereum',
          organizationId: '4',
        },
      };

      walletApi.createWallet = jest.fn().mockResolvedValue(response);

      const result = await walletService.createWallet(example);

      expect(walletApi.createWallet).toHaveBeenCalledWith(data);
      expect(result).toEqual({
        [WalletKeys.TYPE]: WalletTypes.EOA,
        [WalletKeys.ADDRESS]: '1',
        [WalletKeys.FORMAT]: WalletFormats.ETHEREUM,
        [WalletKeys.NAME]: 'name',
        [WalletKeys.SIGNER]: '2',
      });
    });

    it('should throw an error when parsing data fails', async () => {
      const example: IWallet = {
        [WalletKeys.TYPE]: WalletTypes.EOA,
        [WalletKeys.NAME]: 'name',
        [WalletKeys.FORMAT]: WalletFormats.ETHEREUM,
        [WalletKeys.AUTHENTICATION]: authentication,
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
        [WalletKeys.AUTHENTICATION]: authentication,
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
        [WalletKeys.AUTHENTICATION]: authentication,
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
          address: '0xtestAddress',
          signer: {
            address: '0xtestAddress',
            format: WalletFormats.ETHEREUM,
          },
        },
      ];
      const exampleService = [
        {
          [WalletKeys.NAME]: 'testName',
          [WalletKeys.TYPE]: WalletTypes.EOA,
          [WalletKeys.FORMAT]: WalletFormats.ETHEREUM,
          [WalletKeys.ADDRESS]: '0xtestAddress',
          [WalletKeys.SIGNER]: '0xtestAddress',
        },
      ];

      walletApi.getWallets.mockResolvedValueOnce(exampleAPI);

      const result = await walletService.getWallets();

      expect(walletApi.getWallets).toHaveBeenCalled();
      expect(result).toEqual(exampleService);
    });

    it('should throw an error when walletApi.getWallets fails', async () => {
      walletApi.getWallets.mockRejectedValueOnce(
        new APIError('BadRequest', 400),
      );
      await expect(walletService.getWallets()).rejects.toThrow(APIError);
      expect(walletApi.getWallets).toHaveBeenCalled();
    });
  });

  describe('signTransaction', () => {
    const data = {
      walletType: WalletTypes.EOA,
      walletFormat: WalletFormats.ETHEREUM,
      unsignedTransaction: '02ea',
    };

    it('should catch if wrong response from api', async () => {
      walletApi.signTransaction.mockRejectedValue('Failed verify data');
      await expect(
        walletService.signTransaction(wallet, data, 'localhost'),
      ).rejects.toThrow('Failed verify data');
    });

    it('should return signed tx with no quorum required', async () => {
      const response = {
        organizationId: '123',
        needsApproval: false,
        fingerprint: '123',
        activityId: '123',
        signedTransaction: '0x1234',
        status: 'status',
      };
      walletApi.signTransaction.mockResolvedValueOnce(response);

      const result = await walletService.signTransaction(
        wallet,
        data,
        'localhost',
      );

      expect(walletApi.signTransaction).toHaveBeenCalled();
      expect(result).toEqual(response);
    });

    it('should return signed tx with quorum required', async () => {
      WalletSignTransactionResponseSchema.parse = jest.fn().mockResolvedValue({
        result: {
          signTransactionResult: {
            signedTransaction: '0x1234',
          },
        },
      });

      const response = {
        organizationId: '123',
        needsApproval: true,
        fingerprint: '123',
        activityId: '123',
        signedTransaction: '',
        status: 'status',
      };

      walletApi.signTransaction.mockResolvedValueOnce(response);

      jest.spyOn(WebauthnStamper.prototype, 'stamp').mockResolvedValue({
        stampHeaderName: 'name',
        stampHeaderValue: 'value',
      });

      walletApi.approveSignTransaction.mockResolvedValueOnce({
        ...response,
        signedTransaction: '0x1234',
      });

      const result = await walletService.signTransaction(
        wallet,
        data,
        'localhost',
      );

      expect(walletApi.signTransaction).toHaveBeenCalled();
      expect(result).toEqual({ ...response, signedTransaction: '0x1234' });
    });
  });

  describe('getTransactionHistory', () => {
    it('should throw an error when walletApi.getTransactionHistory fails', async () => {
      const error = new Error('Failed to fetch wallets');
      walletApi.getTransactionHistory.mockRejectedValueOnce(error);

      await expect(
        walletService.getTransactionHistory(wallet, chainId),
      ).rejects.toThrow(error);
      expect(walletApi.getTransactionHistory).toHaveBeenCalled();
    });

    it('should get wallets transactions', async () => {
      const example = [
        {
          transactionId: uuidv4(),
          from: wallet,
          chainId: SUPPORTED_CHAINS.ETHEREUM,
          to: wallet,
          value: '1',
          gasLimit: '1',
          maxFeePerGas: '1',
          maxPriorityFeePerGas: '1',
          nonce: 1,
          data: '0x',
          createdAt: '123456',
          updatedAt: '123456',
          updatedBy: '123456',
          organizationId: 'organizationId',
          fingerprint: 'fingerprint',
        },
      ];

      mockedAxios.get.mockResolvedValue({
        data: {
          transactions: example,
          currentPage: 0,
        },
      });

      walletApi.getTransactionHistory.mockResolvedValueOnce({
        transactions: example,
        currentPage: 0,
      });

      const result = await walletService.getTransactionHistory(wallet, chainId);

      expect(walletApi.getTransactionHistory).toHaveBeenCalled();
      expect(result).toEqual({ transactions: example, currentPage: 0 });
    });
  });

  describe('getGasConfig', () => {
    it('should catch if wrong response from api', async () => {
      walletApi.getGasConfig.mockRejectedValueOnce(
        new APIError('BadRequest', 400),
      );
      await expect(walletService.getGasConfig(wallet, chainId)).rejects.toThrow(
        APIError,
      );
    });

    it('should get wallet gas configuration', async () => {
      walletApi.getGasConfig.mockResolvedValueOnce(gasData);

      const result = await walletService.getGasConfig(wallet, chainId);

      expect(walletApi.getGasConfig).toHaveBeenCalled();
      expect(result).toEqual(gasData);
    });
  });

  describe('setGasConfig', () => {
    it('should create wallet gas config if does not exist', async () => {
      const response = { status: 'success' };

      const error = new AxiosError();
      error.message = 'NOT FOUND';
      error.response = {
        status: HttpStatusCode.NotFound,
      } as AxiosResponse;

      walletApi.getGasConfig.mockRejectedValue(error);

      walletApi.createGasConfig.mockResolvedValue(response);

      const result = await walletService.setGasConfig(wallet, chainId, gasData);
      expect(result).toEqual(response);
      expect(walletApi.createGasConfig).toHaveBeenCalledWith(
        wallet,
        chainId,
        gasData,
      );
    });

    it('should update wallet gas config if exists', async () => {
      walletApi.getGasConfig.mockResolvedValueOnce(gasData);
      const response = { status: 'success' };
      walletApi.updateGasConfig.mockResolvedValueOnce(response);

      const result = await walletService.setGasConfig(wallet, chainId, gasData);

      expect(result).toEqual(response);
      expect(walletApi.updateGasConfig).toHaveBeenCalled();
    });

    it('should delete wallet gas config if all values are 0', async () => {
      const deleteGasData = {
        gasLimit: '0',
        maxFeePerGas: '0',
        maxPriorityFeePerGas: '0',
      };
      const response = { status: 'updated' };
      walletApi.deleteGasConfig.mockResolvedValueOnce(response);

      const result = await walletService.setGasConfig(
        wallet,
        chainId,
        deleteGasData,
      );

      expect(walletApi.deleteGasConfig).toHaveBeenCalled();
      expect(result).toEqual(response);
    });

    it('should throw an error when delete gas configuration fails', async () => {
      const deleteGasData = {
        gasLimit: '0',
        maxFeePerGas: '0',
        maxPriorityFeePerGas: '0',
      };

      walletApi.deleteGasConfig.mockRejectedValueOnce(
        new APIError('BadRequest', 400),
      );

      await expect(
        walletService.setGasConfig(wallet, chainId, deleteGasData),
      ).rejects.toThrow(APIError);
      expect(walletApi.deleteGasConfig).toHaveBeenCalled();
    });

    it('should throw an error when setGasConfig fails', async () => {
      walletApi.getGasConfig.mockRejectedValueOnce(new Error());

      await expect(
        walletService.setGasConfig(wallet, chainId, gasData),
      ).rejects.toThrow(Error);
      expect(walletApi.getGasConfig).toHaveBeenCalled();
    });
  });

  describe('getNonce', () => {
    it('should catch if wrong data structure', async () => {
      const exampleAPI = {} as IWalletNonceAPI;

      walletApi.getNonce.mockResolvedValueOnce(exampleAPI);
      await expect(
        walletService.getNonce('0x', SUPPORTED_CHAINS.ETHEREUM),
      ).rejects.toThrow(ZodError);
    });

    it('should get wallet nonce', async () => {
      const exampleAPI = {
        nonce: 1,
      };

      walletApi.getNonce.mockResolvedValueOnce(exampleAPI);

      const result = await walletService.getNonce(
        '0x',
        SUPPORTED_CHAINS.ETHEREUM,
      );

      expect(walletApi.getNonce).toHaveBeenCalled();
      expect(result).toEqual(1);
    });
  });

  describe('initRecover', () => {
    it('should recover wallet successfully', async () => {
      const recoveryData: IWalletRecovery = {
        eoa: {
          organizationId: '44d9a7f9-f745-4b10-ae66-028bc2fc45c0',
          userId: 'fab988c5-62bf-4ea8-9201-dbf670c42626',
          needsApproval: false,
          fingerprint: 'fingerprint',
          activityId: 'activityId',
        },
      };

      walletApi.recover.mockResolvedValue(recoveryData);

      const result = await walletService.initRecovery('address');

      expect(walletApi.recover).toHaveBeenCalledWith(
        expect.anything(),
        'address',
      );
      expect(result).toEqual(recoveryData);
      expect(logger.info).toHaveBeenCalledWith(
        'WalletService: Wallet recovery initiated',
      );
    });

    it('should throw an error when recovery api fails', async () => {
      walletApi.recover.mockRejectedValueOnce(new Error());

      await expect(walletService.initRecovery('address')).rejects.toThrow(
        Error,
      );
      expect(walletApi.recover).toHaveBeenCalled();
    });
  });

  describe('execRecover', () => {
    it('should not exec recover if something fails', async () => {
      jest
        .spyOn(BundleStamper.prototype, 'injectCredentialBundle')
        .mockRejectedValue(new Error('Failed to inject bundle'));

      const organizationId = '44d9a7f9-f745-4b10-ae66-028bc2fc45c0';
      const userId = 'fab988c5-62bf-4ea8-9201-dbf670c42626';

      await expect(
        walletService.execRecovery(
          organizationId,
          userId,
          'passkeyName',
          'bundle',
          'localhost',
        ),
      ).rejects.toThrow(Error);

      expect(logger.info).toHaveBeenCalledWith(
        'WalletService: Wallet recovery executed',
      );
    });

    it('should recover wallet successfully', async () => {
      jest
        .spyOn(BundleStamper.prototype, 'injectCredentialBundle')
        .mockResolvedValueOnce();

      const organizationId = '44d9a7f9-f745-4b10-ae66-028bc2fc45c0';
      const userId = 'fab988c5-62bf-4ea8-9201-dbf670c42626';

      jest.spyOn(BundleUtils, 'create').mockResolvedValue({
        id: 'id',
        response: {
          clientDataJSON: '',
          attestationObject: '',
          transports: ['hybrid'],
        },
      } as PublicKeyCredentialWithAttestationJSON);
      jest.spyOn(BundleStamper.prototype, 'stamp').mockResolvedValue({
        stampHeaderName: 'name',
        stampHeaderValue: 'value',
      });

      const mockResponse = {
        status: 'recovered',
      };

      walletApi.execRecover.mockResolvedValue(mockResponse);

      const result = await walletService.execRecovery(
        organizationId,
        userId,
        'passkeyName',
        'bundle',
        'localhost',
      );

      expect(result).toEqual(mockResponse);
      expect(logger.info).toHaveBeenCalledWith(
        'WalletService: Wallet recovery executed',
      );
    });
  });

  describe('getPortfolio', () => {
    it('should get portfolio', async () => {
      const exampleAPI = {
        address: '0xtestAddress',
        chainId: SUPPORTED_CHAINS.ETHEREUM,
        portfolio: [],
      };

      walletApi.getPortfolio.mockResolvedValueOnce(exampleAPI);

      const result = await walletService.getPortfolio(wallet, chainId);

      expect(walletApi.getPortfolio).toHaveBeenCalled();
      expect(result).toEqual(exampleAPI);
    });

    it('should throw an error when walletApi.getPortfolio fails', async () => {
      walletApi.getPortfolio.mockRejectedValueOnce(
        new APIError('BadRequest', 400),
      );
      await expect(walletService.getPortfolio(wallet, chainId)).rejects.toThrow(
        APIError,
      );
      expect(walletApi.getPortfolio).toHaveBeenCalled();
    });
  });

  describe('getNotifications', () => {
    it('should get notifications', async () => {
      const exampleNotifications: IWalletNotifications = [];

      walletApi.getNotifications.mockResolvedValueOnce(exampleNotifications);

      const result = await walletService.getNotifications();

      expect(walletApi.getNotifications).toHaveBeenCalled();
      expect(result).toEqual(exampleNotifications);
    });

    it('should throw an error when walletApi.getNotifications fails', async () => {
      walletApi.getNotifications.mockRejectedValueOnce(
        new APIError('BadRequest', 400),
      );
      await expect(walletService.getNotifications()).rejects.toThrow(APIError);
      expect(walletApi.getNotifications).toHaveBeenCalled();
    });
  });

  describe('Approve Or Reject Sign Tx', () => {
    const organizationId = 'id';
    const fingerprint = 'fingerprint';
    const response = {
      organizationId,
      needsApproval: true,
      fingerprint,
      activityId: '123',
      signedTransaction: '',
      status: 'status',
    };

    it('should throw an error when any action fails', async () => {
      await expect(
        walletService.approveTransaction(
          'address',
          organizationId,
          fingerprint,
          'localhost',
        ),
      ).rejects.toThrow('Failed to make a decision');
    });

    it('should throw an error when any action fails', async () => {
      await expect(
        walletService.rejectTransaction(
          'address',
          organizationId,
          fingerprint,
          'localhost',
        ),
      ).rejects.toThrow('Failed to make a decision');
    });

    it('should approve', async () => {
      jest.spyOn(WebauthnStamper.prototype, 'stamp').mockResolvedValue({
        stampHeaderName: 'name',
        stampHeaderValue: 'value',
      });

      walletApi.approveSignTransaction.mockResolvedValueOnce({
        ...response,
        signedTransaction: '0x1234',
      });

      const result = await walletService.approveTransaction(
        'address',
        organizationId,
        fingerprint,
        'localhost',
      );

      expect(result).toEqual({ ...response, signedTransaction: '0x1234' });
    });

    it('should reject', async () => {
      jest.spyOn(WebauthnStamper.prototype, 'stamp').mockResolvedValue({
        stampHeaderName: 'name',
        stampHeaderValue: 'value',
      });

      walletApi.rejectSignTransaction.mockResolvedValueOnce(response);

      const result = await walletService.rejectTransaction(
        'address',
        organizationId,
        fingerprint,
        'localhost',
      );

      expect(result).toEqual(response);
    });
  });
});
