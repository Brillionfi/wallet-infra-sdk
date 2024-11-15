import { Address, ChainId } from '@models/common.models';
import { ITransaction, TransactionSchema } from '@models/transaction.models';
import type {
  IWalletAPI,
  IWalletResponse,
  IWalletNonceAPI,
  IWalletGasConfiguration,
  IWalletGasConfigurationAPI,
  IWalletGasEstimation,
  IGetGasFeesParameters,
  IWalletSignTransactionResponse,
  IExecRecoveryRequest,
  IWalletNotifications,
  IWalletPortfolio,
  IExecRecovery,
  TApproveAndRejectSignTxRequest,
} from '@models/wallet.models';
import {
  WalletResponseSchema,
  WalletNonceResponseSchema,
  IWalletSignTransaction,
  WalletSignTransactionResponseSchema,
  WalletGasConfigurationSchema,
  WalletGasConfigurationResponseSchema,
  WalletGasEstimationSchema,
  WalletRecoverySchema,
  IWalletRecovery,
  WalletPortfolioSchema,
  WalletNotificationsSchema,
  ExecRecoveryResponseSchema,
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

  public async getWallets(): Promise<IWalletResponse[]> {
    logger.debug(`${this.className}: Getting Wallets`);
    try {
      const response: AxiosResponse = await this.httpClient.get('/wallets');
      const wallets = WalletResponseSchema.array().parse(response.data);
      return wallets;
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async signTransaction(
    address: Address,
    data: IWalletSignTransaction,
  ): Promise<IWalletSignTransactionResponse> {
    logger.debug(`${this.className}: Signing transaction`);
    try {
      const response: AxiosResponse = await this.httpClient.post(
        `/wallets/${address}/sign`,
        data,
      );
      return WalletSignTransactionResponseSchema.parse(response.data.data);
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
    page = 0,
    indexer?: 'internal' | 'external',
  ): Promise<{ transactions: Partial<ITransaction>[]; currentPage: number }> {
    logger.debug(`${this.className}: Getting Wallets`);
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `/wallets/${address}/chains/${chainId}/transactions?page=${page}&&indexer=${indexer ? indexer : 'internal'}`,
      );

      const transactions = TransactionSchema.partial()
        .array()
        .parse(response.data.transactions);

      return { transactions, currentPage: parseInt(response.data.currentPage) };
    } catch (error) {
      throw handleError(error);
    }
  }

  public async recover(
    targetPublicKey: string,
    address: string,
  ): Promise<IWalletRecovery> {
    logger.debug(`${this.className}: Wallet Recovery`);
    try {
      const body = {
        eoa: {
          targetPublicKey,
        },
      };
      const response: AxiosResponse = await this.httpClient.post(
        `/wallets/${address}/recovery`,
        body,
      );

      return WalletRecoverySchema.parse(response.data.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async execRecover(body: IExecRecoveryRequest): Promise<IExecRecovery> {
    logger.debug(`${this.className}: Wallet Recovery Execute`);
    try {
      const response: AxiosResponse = await this.httpClient.post(
        '/wallets/recovery/execute',
        body,
      );

      return ExecRecoveryResponseSchema.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async getPortfolio(
    address: Address,
    chainId: ChainId,
  ): Promise<IWalletPortfolio> {
    logger.debug(`${this.className}: Get Wallet Portfolio`);
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `/wallets/portfolio/${address}/${chainId}`,
      );

      return WalletPortfolioSchema.parse(response.data.data);
    } catch (error) {
      throw handleError(error);
    }
  }

  public async getNotifications(): Promise<IWalletNotifications> {
    logger.debug(`${this.className}: Get Wallet Notifications`);
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `/wallets/notifications`,
      );

      return WalletNotificationsSchema.parse(response.data.messages);
    } catch (error) {
      throw handleError(error);
    }
  }

  public async approveSignTransaction(
    body: TApproveAndRejectSignTxRequest,
  ): Promise<IWalletSignTransactionResponse> {
    logger.debug(`${this.className}: Approving transaction`);
    try {
      const response: AxiosResponse = await this.httpClient.post(
        `/wallets/${body.address}/sign/${body.fingerprint}/approve`,
        body,
      );

      return WalletSignTransactionResponseSchema.parse(response.data);
    } catch (error) {
      throw handleError(error);
    }
  }

  public async rejectSignTransaction(
    body: TApproveAndRejectSignTxRequest,
  ): Promise<IWalletSignTransactionResponse> {
    logger.debug(`${this.className}: Rejecting transaction`);
    try {
      const response: AxiosResponse = await this.httpClient.post(
        `/wallets/${body.address}/sign/${body.fingerprint}/reject`,
        body,
      );

      return WalletSignTransactionResponseSchema.parse(response.data);
    } catch (error) {
      throw handleError(error);
    }
  }
}
