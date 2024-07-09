import { Address, ChainId } from '@models/common.models';
import { ITransaction, TransactionSchema } from '@models/transaction.models';
import type {
  IWallet,
  IWalletAPI,
  IWalletResponse,
  IWalletNonceAPI,
  IWalletGasConfiguration,
  IWalletGasConfigurationAPI,
  IWalletGasEstimation,
  IGetGasFeesParameters,
} from '@models/wallet.models';
import {
  WalletResponseSchema,
  WalletNonceResponseSchema,
  WalletSchema,
  IWalletSignTransaction,
  WalletSignTransactionResponseSchema,
  IWalletSignTransactionAPI,
  WalletGasConfigurationSchema,
  WalletGasConfigurationResponseSchema,
  WalletGasEstimationSchema,
  WalletRecoverySchema,
  IWalletRecovery,
  WalletPortfolioSchema,
} from '@models/wallet.models';
import { APIError, handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import logger from 'loglevel';
import { AxiosResponse } from 'axios';

export class WalletApi {
  private readonly className: string;

  constructor(private httpClient: HttpClient) {
    this.className = this.constructor.name;
  }

  public async createWallet(data: IWalletAPI): Promise<IWalletResponse> {
    logger.debug(`${this.className}: Creating Wallet`);
    try {
      const response: AxiosResponse = await this.httpClient.post(
        '/wallets',
        data,
      );
      return WalletResponseSchema.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async getWallets(): Promise<IWallet[]> {
    logger.debug(`${this.className}: Getting Wallets`);
    try {
      const response: AxiosResponse = await this.httpClient.get('/wallets');
      const wallets = WalletSchema.array().parse(response.data);
      return wallets;
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async signTransaction(
    address: Address,
    data: IWalletSignTransaction,
  ): Promise<IWalletSignTransactionAPI> {
    logger.debug(`${this.className}: Signing transaction`);
    try {
      const response = await this.httpClient.post(
        `/wallets/${address}/sign`,
        data,
      );
      return WalletSignTransactionResponseSchema.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async createGasConfig(
    address: Address,
    chainId: ChainId,
    data: IWalletGasConfiguration,
  ): Promise<IWalletGasConfigurationAPI> {
    logger.debug(`${this.className}: Setting wallet gas configuration`);
    try {
      const response: AxiosResponse = await this.httpClient.post(
        `/wallets/${address}/chains/${chainId}/gas-station`,
        data,
      );
      return WalletGasConfigurationResponseSchema.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async updateGasConfig(
    address: Address,
    chainId: ChainId,
    data: IWalletGasConfiguration,
  ): Promise<IWalletGasConfigurationAPI> {
    logger.debug(`${this.className}: Updating wallet gas configuration`);
    try {
      const response: AxiosResponse = await this.httpClient.patch(
        `/wallets/${address}/chains/${chainId}/gas-station`,
        data,
      );
      return WalletGasConfigurationResponseSchema.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async deleteGasConfig(
    address: Address,
    chainId: ChainId,
  ): Promise<IWalletGasConfigurationAPI> {
    logger.debug(`${this.className}: Deleting wallet gas configuration`);
    try {
      const response: AxiosResponse = await this.httpClient.delete(
        `/wallets/${address}/chains/${chainId}/gas-station`,
      );
      return WalletGasConfigurationResponseSchema.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async getGasConfig(
    address: Address,
    chainId: ChainId,
  ): Promise<IWalletGasConfiguration> {
    logger.debug(`${this.className}: Getting wallet gas configuration`);
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `/wallets/${address}/chains/${chainId}/gas-station`,
      );
      return WalletGasConfigurationSchema.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async getGasFees({
    chainId,
    from,
    to,
    value,
    data,
  }: IGetGasFeesParameters): Promise<IWalletGasEstimation> {
    logger.info(`${this.className}: Getting transaction gas estimation`);
    try {
      const response: AxiosResponse = await this.httpClient.post(
        `/transactions/estimate`,
        {
          chainId,
          raw: { from, to, value, data },
        },
      );
      return WalletGasEstimationSchema.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async getNonce(
    address: Address,
    chainId: ChainId,
  ): Promise<IWalletNonceAPI> {
    logger.info('Getting wallet nonce');
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `/wallets/${address}/chains/${chainId}/nonce`,
      );
      return WalletNonceResponseSchema.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async getTransactionHistory(
    address: Address,
    chainId: ChainId,
  ): Promise<ITransaction[]> {
    logger.debug(`${this.className}: Getting Wallets`);
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `wallets/${address}/chains/${chainId}/transactions`,
      );
      const wallets = TransactionSchema.array().parse(response.data);
      return wallets;
    } catch (error) {
      throw handleError(error);
    }
  }

  public async recover(targetPublicKey: string): Promise<IWalletRecovery> {
    logger.debug(`${this.className}: Wallet Recovery`);
    try {
      const body = {
        eoa: {
          targetPublicKey,
        },
      };
      const response: AxiosResponse = await this.httpClient.post(
        '/wallets/recovery',
        body,
      );

      return WalletRecoverySchema.parse(response.data.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async getPortfolio(address: Address, chainId: ChainId) {
    logger.debug(`${this.className}: Get Wallet Portfolio`);
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `/wallets/portfolio/${address}/${chainId}`,
      );

      const portfolio = WalletPortfolioSchema.parse(response.data.data);
      return portfolio;
    } catch (error) {
      throw handleError(error);
    }
  }
}
