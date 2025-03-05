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
  IRpcParamsRequest,
  IRpcBodyRequest,
  IRpcResponse,
  IWalletAuthenticator,
  IWalletAuthenticatorResponse,
  ICreateWalletAuthenticatorResponse,
  IWalletSignMessage,
  IWalletSignMessageResponse,
  IWalletAuthenticatorConsentSchema,
  IWalletAuthenticatorConsentResponseSchema,
  IWalletRecoveryByEmailStatus,
  ISetRecoveryByEmailStatusResponse,
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
  RpcResponse,
  WalletAuthenticatorResponse,
  CreateWalletAuthenticatorResponse,
  WalletSignMessageResponseSchema,
  WalletAuthenticatorConsentResponseSchema,
  WalletRecoveryByEmailStatus,
  SetRecoveryByEmailStatusResponse,
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
  public async createWalletAuthenticator(
    authenticator: IWalletAuthenticator,
  ): Promise<ICreateWalletAuthenticatorResponse> {
    logger.debug(`${this.className}: Creating authenticator`);
    try {
      const response: AxiosResponse = await this.httpClient.post(
        '/wallets/auth',
        authenticator,
      );
      return CreateWalletAuthenticatorResponse.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }
  public async getWalletAuthenticator(): Promise<IWalletAuthenticatorResponse> {
    logger.debug(`${this.className}: Getting Wallets`);
    try {
      const response: AxiosResponse =
        await this.httpClient.get('/wallets/auth');
      const authenticators = WalletAuthenticatorResponse.parse(response.data);
      return authenticators;
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

  public async rawSignMessage(
    address: Address,
    data: IWalletSignMessage,
  ): Promise<IWalletSignMessageResponse> {
    logger.debug(`${this.className}: Signing transaction`);
    try {
      const response: AxiosResponse = await this.httpClient.post(
        `/wallets/${address}/raw-sign`,
        data,
      );
      return WalletSignMessageResponseSchema.parse(response.data.data);
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

  public async approveCreateWalletAuthenticator(
    data: IWalletAuthenticatorConsentSchema,
  ): Promise<IWalletAuthenticatorConsentResponseSchema> {
    logger.debug(`${this.className}: Signing transaction`);
    try {
      const response: AxiosResponse = await this.httpClient.post(
        `/wallets/auth/approve`,
        { ...data, fingerPrint: data.fingerprint }, //TODO fix uppercase in API
      );
      return WalletAuthenticatorConsentResponseSchema.parse(response.data);
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
  public async getRecoveryByEmailStatus(): Promise<IWalletRecoveryByEmailStatus> {
    logger.debug(`${this.className}: get wallet recovery by email`);
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `/wallets/recovery/status`,
      );
      return WalletRecoveryByEmailStatus.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async setRecoveryByEmailStatus(
    recoverRequestByBrillion: boolean,
  ): Promise<ISetRecoveryByEmailStatusResponse> {
    logger.debug(`${this.className}: set recovery by email status`);
    try {
      const response: AxiosResponse = await this.httpClient.post(
        `/wallets/recovery/status`,
        {
          recoverRequestByBrillion,
        },
      );
      return SetRecoveryByEmailStatusResponse.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
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
        `/wallets/recovery`,
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

  public async rpcRequest(
    body: IRpcBodyRequest,
    params: IRpcParamsRequest,
  ): Promise<IRpcResponse> {
    logger.debug(`${this.className}: Wallet provider request`);
    try {
      const response: AxiosResponse = await this.httpClient.post(
        `/rpc/chainId/${params.chainId}`,
        body,
      );

      return RpcResponse.parse(response.data);
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
