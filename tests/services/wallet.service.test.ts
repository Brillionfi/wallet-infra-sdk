/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSDOM } from 'jsdom';
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
} from '@models/wallet.models';
import { SUPPORTED_CHAINS } from '@models/common.models';
import { APIError, CustomError } from '@utils/errors';
import { ZodError } from 'zod';
import { AxiosError, AxiosResponse, HttpStatusCode } from 'axios';
import { HttpClient } from '@utils/http-client';
import logger from 'loglevel';

jest.mock('@api/wallet.api');
jest.mock('@utils/http-client');
jest.mock('@utils/http-client');
jest.mock('loglevel', () => ({
  info: jest.fn(),
  debug: jest.fn(),
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
    walletApi = new WalletApi(new HttpClient()) as jest.Mocked<WalletApi>;

    (WalletApi as jest.Mock<WalletApi>).mockImplementation(() => walletApi);

    walletService = new WalletService(new HttpClient());
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
      await expect(walletService.signTransaction(wallet, data)).rejects.toThrow(
        'Failed verify data',
      );
    });

    it('should get wallet nonce', async () => {
      const response = { signedTransaction: '0x1234' };
      walletApi.signTransaction.mockResolvedValueOnce(response);

      const result = await walletService.signTransaction(wallet, data);

      expect(walletApi.signTransaction).toHaveBeenCalled();
      expect(result).toEqual(response);
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

    it('should get wallets', async () => {
      const example = [
        {
          transactionId: 'id',
          transactionHash: 'hash',
          address: wallet,
          chainId: SUPPORTED_CHAINS.ETHEREUM,
          walletAddress: wallet,
          createdAt: '123456',
          updatedAt: '123456',
          updatedBy: '123456',
        },
      ];

      walletApi.getTransactionHistory.mockResolvedValueOnce(example);

      const result = await walletService.getTransactionHistory(wallet, chainId);

      expect(walletApi.getTransactionHistory).toHaveBeenCalled();
      expect(result).toEqual(example);
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

      walletApi.getGasConfig.mockImplementation(() => {
        const error = new AxiosError(
          'NOT FOUND',
          undefined,
          undefined,
          undefined,
          {
            status: HttpStatusCode.NotFound,
          } as AxiosResponse,
        );
        return Promise.reject(error);
      });

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

  describe('generateTargetPublicKey', () => {
    let iframeContainer: HTMLElement;
    const iframeUrl = 'https://example.com/iframe';
    const iframeElementId = 'myIframe';
    let addEventListenerSpy: jest.SpyInstance;
    let removeEventListenerSpy: jest.SpyInstance;
    let postMessageSpy: jest.SpyInstance;

    beforeEach(() => {
      const dom = new JSDOM('<!DOCTYPE html><div id="container"></div>');
      global.document = dom.window.document;
      global.window = dom.window as unknown as Window & typeof globalThis;

      iframeContainer = document.getElementById('container')!;

      addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      postMessageSpy = jest.spyOn(window, 'postMessage');
    });

    afterEach(() => {
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
      postMessageSpy.mockRestore();
    });

    it('should resolve with the public key when PUBLIC_KEY_READY event is received', async () => {
      const publicKey = 'public-key-value';

      addEventListenerSpy.mockImplementation((event, handler) => {
        if (event === 'message') {
          handler({
            origin: 'https://example.com',
            data: { type: 'PUBLIC_KEY_READY', value: publicKey },
          } as MessageEvent);
        }
      });

      const result = await walletService.generateTargetPublicKey(
        iframeUrl,
        iframeElementId,
        iframeContainer,
      );
      expect(result).toBe(publicKey);
    });

    it('should reject with an error when ERROR event is received', async () => {
      const errorMessage = 'error-value';

      addEventListenerSpy.mockImplementation((event, handler) => {
        if (event === 'message') {
          handler({
            origin: 'https://example.com',
            data: { type: 'ERROR', value: errorMessage },
          } as MessageEvent);
        }
      });

      await expect(
        walletService.generateTargetPublicKey(
          iframeUrl,
          iframeElementId,
          iframeContainer,
        ),
      ).rejects.toBe(errorMessage);
    });

    it('should handle other message types correctly', async () => {
      addEventListenerSpy.mockImplementation((event, handler) => {
        if (event === 'message') {
          handler({
            origin: 'https://example.com',
            data: { type: 'OTHER_TYPE', value: 'some-value' },
          } as MessageEvent);
        }
      });

      const promise = walletService.generateTargetPublicKey(
        iframeUrl,
        iframeElementId,
        iframeContainer,
      );

      await expect(
        Promise.race([promise, Promise.resolve('not-resolved')]),
      ).resolves.toBe('not-resolved');
      expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });

    it('should throw an error if iframe container is not found', async () => {
      await expect(
        walletService.generateTargetPublicKey(
          iframeUrl,
          iframeElementId,
          null as any,
        ),
      ).rejects.toThrow('Iframe container cannot be found');
    });

    it('should throw an error if an iframe with the same ID already exists', async () => {
      const existingIframe = document.createElement('iframe');
      existingIframe.id = iframeElementId;
      iframeContainer.appendChild(existingIframe);

      await expect(
        walletService.generateTargetPublicKey(
          iframeUrl,
          iframeElementId,
          iframeContainer,
        ),
      ).rejects.toThrow(
        `Iframe element with ID ${iframeElementId} already exists`,
      );
    });

    it('should throw an error if not in a browser environment', async () => {
      const originalWindow = global.window;
      delete (global as any).window;

      try {
        await expect(
          walletService.generateTargetPublicKey(
            iframeUrl,
            iframeElementId,
            iframeContainer,
          ),
        ).rejects.toThrow(
          'Cannot initialize iframe in non-browser environment',
        );
      } finally {
        global.window = originalWindow;
      }
    });

    it('should ignore messages from different origins', async () => {
      const publicKey = 'public-key-value';

      addEventListenerSpy.mockImplementation((event, handler) => {
        if (event === 'message') {
          handler({
            origin: 'https://different-origin.com',
            data: { type: 'PUBLIC_KEY_READY', value: publicKey },
          } as MessageEvent);
        }
      });

      const promise = walletService.generateTargetPublicKey(
        iframeUrl,
        iframeElementId,
        iframeContainer,
      );

      await expect(
        Promise.race([promise, Promise.resolve('not-resolved')]),
      ).resolves.toBe('not-resolved');
      expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });
  });

  describe('recover', () => {
    const privateKey = 'mock-private-key';

    it('should recover wallet successfully', async () => {
      const recoveryData: IWalletRecovery = {
        eoa: {
          organizationId: '44d9a7f9-f745-4b10-ae66-028bc2fc45c0',
          userId: 'fab988c5-62bf-4ea8-9201-dbf670c42626',
        },
      };

      walletApi.recover.mockResolvedValue(recoveryData);

      const result = await walletService.recover(privateKey);

      expect(walletApi.recover).toHaveBeenCalledWith(privateKey);
      expect(result).toEqual(recoveryData);
      expect(logger.info).toHaveBeenCalledWith(
        'WalletService: Recovering wallet',
      );
    });

    it('should throw an error when recovery api fails', async () => {
      const privateKey = 'mock-private-key';

      walletApi.recover.mockRejectedValueOnce(new Error());

      await expect(walletService.recover(privateKey)).rejects.toThrow(Error);
      expect(walletApi.recover).toHaveBeenCalled();
    });
  });
});
