import { WalletApi } from '@api/wallet.api';
import { Address, ChainId } from '@models/common.models';
import {
  WalletSchemaAPI,
  IWalletAPI,
  IWallet,
  IWalletResponse,
  WalletKeys,
  IWalletGasConfiguration,
  IWalletGasConfigurationAPI,
  WalletNonceResponseSchema,
} from '@models/wallet.models';
import { CustomError, handleError } from '@utils/errors';
import logger from '@utils/logger';
import { AxiosError, HttpStatusCode } from 'axios';

export class WalletService {
  private readonly className: string;
  private walletApi: WalletApi;

  constructor() {
    this.className = this.constructor.name;
    this.walletApi = new WalletApi();
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
      if (
        parseInt(configuration.gasLimit) === 0 &&
        parseInt(configuration.maxFeePerGas) === 0 &&
        parseInt(configuration.maxPriorityFeePerGas) === 0
      ) {
        return await this.walletApi.deleteGasConfig(address, chainId);
      }
    } catch (error) {
      throw handleError(error);
    }

    try {
      await this.getGasConfig(address, chainId);
      return await this.walletApi.updateGasConfig(
        address,
        chainId,
        configuration,
      );
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response?.status === HttpStatusCode.NotFound
      ) {
        return await this.walletApi.setGasConfig(
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
