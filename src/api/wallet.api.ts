import { Address, ChainId } from '@models/common.models';
import {
  IWallet,
  IWalletAPI,
  IWalletResponse,
  IWalletNonceAPI,
  WalletResponseSchema,
  WalletNonceResponseSchema,
  WalletSchema,
  IWalletSignTransaction,
  WalletSignTransactionResponseSchema,
  IWalletSignTransactionAPI,
  IWalletGasConfiguration,
  WalletGasConfigurationSchema,
  IWalletGasConfigurationAPI,
  WalletGasConfigurationResponseSchema,
} from '@models/wallet.models';
import { APIError, handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import logger from '@utils/logger';
import { AxiosResponse } from 'axios';

export class WalletApi {
  private readonly className: string;
  private httpClient: HttpClient;

  constructor() {
    this.className = this.constructor.name;
    this.httpClient = new HttpClient();
  }

  public async createWallet(data: IWalletAPI): Promise<IWalletResponse> {
    logger.debug(`${this.className}: Creating Wallet`);
    try {
      const response = await this.httpClient.post('/wallets', data);
      return WalletResponseSchema.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async getWallets(): Promise<IWallet[]> {
    logger.debug(`${this.className}: Getting Wallets`);
    try {
      const response = await this.httpClient.get('/wallets');
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
}
