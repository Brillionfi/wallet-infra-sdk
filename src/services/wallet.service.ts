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
} from '@models/wallet.models';
import { CustomError, handleError } from '@utils/errors';
import logger from '@utils/logger';

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

  public async getGasConfiguration(
    address: Address,
    chainId: ChainId,
  ): Promise<IWalletGasConfiguration> {
    logger.info(`${this.className}: Getting Wallet gas configuration`);

    const url = `/wallets/${address}/chains/${chainId}/gas-station`;

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

    const url = `/wallets/${address}/chains/${chainId}/gas-station`;

    try {
      // deletes configuration if set to 0
      if (
        parseInt(configuration.gasLimit) === 0 ||
        parseInt(configuration.maxFeePerGas) === 0 ||
        parseInt(configuration.maxPriorityFeePerGas) === 0
      ) {
        return await this.walletApi.deleteGasConfiguration(url);
      }

      const currentConfig = await this.getGasConfiguration(address, chainId);
      // updates configuration if it already exists
      if (
        parseInt(currentConfig.gasLimit) >= 0 ||
        parseInt(currentConfig.maxFeePerGas) >= 0 ||
        parseInt(currentConfig.maxPriorityFeePerGas) >= 0
      ) {
        return await this.walletApi.updateGasConfiguration(url, configuration);
      }

      // creates configuration
      return await this.walletApi.setGasConfiguration(url, configuration);
    } catch (error) {
      throw new CustomError('Failed verify data');
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
