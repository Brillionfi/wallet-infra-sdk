import { WalletApi } from '@api/wallet.api';
import { Address, ChainId } from '@models/common.models';
import {
  WalletSchemaAPI,
  IWalletAPI,
  IWallet,
  IWalletResponse,
  WalletKeys,
  WalletNonceResponseSchema,
  IWalletGasConfiguration,
  IWalletGasConfigurationAPI,
} from '@models/wallet.models';
import { CustomError, handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import logger from '@utils/logger';

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

  private parseCreateWalletData(data: IWallet): IWalletAPI {
    try {
      return WalletSchemaAPI.parse({
        walletType: {
          [data[WalletKeys.TYPE]]: {
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

  public async getWalletNonce(
    address: Address,
    chainId: ChainId,
  ): Promise<number> {
    logger.info(`${this.className}: Getting Wallet nonce`);

    const url = '/wallets/:address/chains/:chainId/nonce'
      .replace(':address', address)
      .replace(':chainId', chainId);

    try {
      const data = await this.walletApi.getWalletNonce(url);
      const nonce = await WalletNonceResponseSchema.parse(data);
      return nonce.nonce;
    } catch (error) {
      throw new CustomError('Failed verify data');
    }
  }

  public async getGasConfiguration(
    address: Address,
    chainId: ChainId,
  ): Promise<IWalletGasConfiguration> {
    logger.info(`${this.className}: Getting Wallet gas configuration`);

    const url = '/wallets/:address/chains/:chainId/gas-station'
      .replace(':address', address)
      .replace(':chainId', chainId);

    try {
      return await this.walletApi.getGasConfiguration(url);
    } catch (error) {
      throw new CustomError('Failed verify data');
    }
  }

  public async setGasConfiguration(
    address: Address,
    chainId: ChainId,
    configuration: IWalletGasConfiguration,
  ): Promise<IWalletGasConfigurationAPI> {
    logger.info(`${this.className}: Setting Wallet gas configuration`);

    const url = '/wallets/:address/chains/:chainId/gas-station'
      .replace(':address', address)
      .replace(':chainId', chainId);

    try {
      return await this.walletApi.setGasConfiguration(url, configuration);
    } catch (error) {
      throw new CustomError('Failed verify data');
    }
  }

  public async updateGasConfiguration(
    address: Address,
    chainId: ChainId,
    configuration: IWalletGasConfiguration,
  ): Promise<IWalletGasConfigurationAPI> {
    logger.info(`${this.className}: Updating Wallet gas configuration`);

    const url = '/wallets/:address/chains/:chainId/gas-station'
      .replace(':address', address)
      .replace(':chainId', chainId);

    try {
      return await this.walletApi.updateGasConfiguration(url, configuration);
    } catch (error) {
      throw new CustomError('Failed verify data');
    }
  }

  public async deleteGasConfiguration(
    address: Address,
    chainId: ChainId,
  ): Promise<IWalletGasConfigurationAPI> {
    logger.info(`${this.className}: Deleting Wallet gas configuration`);

    const url = '/wallets/:address/chains/:chainId/gas-station'
      .replace(':address', address)
      .replace(':chainId', chainId);

    try {
      return await this.walletApi.deleteGasConfiguration(url);
    } catch (error) {
      throw new CustomError('Failed verify data');
    }
  }
}
