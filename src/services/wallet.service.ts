import { WalletApi } from '@api/wallet.api';
import { Address, ChainId } from '@models/common.models';
import { ITransaction } from '@models/transaction.models';
import {
  WalletSchemaAPI,
  IWalletAPI,
  IWallet,
  IWalletResponse,
  WalletKeys,
  IWalletSignTransaction,
  IWalletSignTransactionAPI,
  IWalletGasConfiguration,
  IWalletGasConfigurationAPI,
  WalletNonceResponseSchema,
  IWalletRecovery,
} from '@models/wallet.models';
import { CustomError, handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import logger from 'loglevel';
import { AxiosError, HttpStatusCode } from 'axios';

export class WalletService {
  private readonly className: string;
  private walletApi: WalletApi;

  constructor(httpClient: HttpClient) {
    this.className = this.constructor.name;
    this.walletApi = new WalletApi(httpClient);
  }

  public async createWallet(data: IWallet): Promise<IWallet> {
    logger.info(`${this.className}: Creating wallet`);
    try {
      const parsedWalletData = this.parseCreateWalletData(data);
      const createdWallet = await this.walletApi.createWallet(parsedWalletData);
      const parsedWallet = this.parseCreateWalletResponse(createdWallet);

      return parsedWallet;
    } catch (error) {
      throw handleError(error);
    }
  }

  public async getWallets(): Promise<IWallet[]> {
    logger.info(`${this.className}: Getting Wallets`);
    try {
      const wallets: IWallet[] = await this.walletApi.getWallets();
      return wallets;
    } catch (error) {
      throw handleError(error);
    }
  }

  public async signTransaction(
    address: Address,
    data: IWalletSignTransaction,
  ): Promise<IWalletSignTransactionAPI> {
    logger.info(`${this.className}: Setting Wallet gas configuration`);

    try {
      return await this.walletApi.signTransaction(address, data);
    } catch (error) {
      throw new CustomError('Failed verify data');
    }
  }

  public async getTransactionHistory(
    address: Address,
    chainId: ChainId,
  ): Promise<ITransaction[]> {
    logger.info(`${this.className}: Getting Wallet transaction history`);
    try {
      return await this.walletApi.getTransactionHistory(address, chainId);
    } catch (error) {
      throw handleError(error);
    }
  }

  public async getGasConfig(
    address: Address,
    chainId: ChainId,
  ): Promise<IWalletGasConfiguration> {
    logger.info(`${this.className}: Getting Wallet gas configuration`);
    try {
      return await this.walletApi.getGasConfig(address, chainId);
    } catch (error) {
      throw handleError(error);
    }
  }

  public async setGasConfig(
    address: Address,
    chainId: ChainId,
    configuration: IWalletGasConfiguration,
  ): Promise<IWalletGasConfigurationAPI> {
    logger.info(`${this.className}: Setting Wallet gas configuration`);

    try {
      // delete gas configuration if all values are 0
      if (
        parseInt(configuration.gasLimit) === 0 &&
        parseInt(configuration.maxFeePerGas) === 0 &&
        parseInt(configuration.maxPriorityFeePerGas) === 0
      ) {
        return await this.walletApi.deleteGasConfig(address, chainId);
      } else {
        // update if gas configuration already exists
        await this.walletApi.getGasConfig(address, chainId);
        return await this.walletApi.updateGasConfig(
          address,
          chainId,
          configuration,
        );
      }
    } catch (error) {
      // if not found create new gas configuration
      if (
        error instanceof AxiosError &&
        error.response?.status === HttpStatusCode.NotFound
      ) {
        return await this.walletApi.createGasConfig(
          address,
          chainId,
          configuration,
        );
      } else {
        throw handleError(error);
      }
    }
  }

  public async getNonce(address: Address, chainId: ChainId): Promise<number> {
    try {
      const data = await this.walletApi.getNonce(address, chainId);
      const nonce = await WalletNonceResponseSchema.parse(data);
      return nonce.nonce;
    } catch (error) {
      throw handleError(error);
    }
  }

  public async recover(privateKey: string): Promise<IWalletRecovery> {
    logger.info(`${this.className}: Recovering wallet`);
    try {
      return await this.walletApi.recover(privateKey);
    } catch (error) {
      throw handleError(error);
    }
  }

  public async generateTargetPublicKey(
    iframeUrl: string,
    iframeElementId: string,
    iframeContainer: HTMLElement,
  ): Promise<string> {
    if (typeof window === 'undefined') {
      throw new Error('Cannot initialize iframe in non-browser environment');
    }

    if (!iframeContainer) {
      throw new Error('Iframe container cannot be found');
    }

    if (iframeContainer.querySelector(`#${iframeElementId}`)) {
      throw new Error(
        `Iframe element with ID ${iframeElementId} already exists`,
      );
    }

    const iframe = window.document.createElement('iframe');

    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');

    // Set the iframe ID and source URL
    iframe.id = iframeElementId;
    iframe.src = iframeUrl;

    const iframeOrigin = new URL(iframeUrl).origin;
    iframeContainer.appendChild(iframe);

    return new Promise((resolve, reject) => {
      window.addEventListener('message', function onMessage(event) {
        if (event.origin !== iframeOrigin) {
          return;
        }

        if (event.data?.type === 'PUBLIC_KEY_READY') {
          resolve(event.data['value']);
          window.removeEventListener('message', onMessage);
        }

        if (event.data?.type === 'ERROR') {
          reject(event.data['value']);
          window.removeEventListener('message', onMessage);
        }
      });
    });
  }

  private parseCreateWalletData(data: IWallet): IWalletAPI {
    try {
      return WalletSchemaAPI.parse({
        walletType: {
          [data[WalletKeys.TYPE].toLocaleLowerCase()]: {
            walletName: data[WalletKeys.NAME],
            walletFormat: data[WalletKeys.FORMAT],
            authenticationType: data[WalletKeys.AUTHENTICATION_TYPE],
          },
        },
      });
    } catch (error) {
      throw new CustomError('Failed to parse create wallet data');
    }
  }

  private parseCreateWalletResponse(data: IWalletResponse): IWallet {
    try {
      const walletTypeKey = Object.keys(data)[0];
      const walletData = data[walletTypeKey];

      return {
        [WalletKeys.TYPE]: walletData.walletType,
        [WalletKeys.ADDRESS]: walletData.walletAddress,
        [WalletKeys.FORMAT]: walletData.walletFormat,
        [WalletKeys.NAME]: walletData.walletName,
        [WalletKeys.AUTHENTICATION_TYPE]: walletData.authenticationType,
      };
    } catch (error) {
      throw new CustomError('Failed to create wallet response');
    }
  }
}
