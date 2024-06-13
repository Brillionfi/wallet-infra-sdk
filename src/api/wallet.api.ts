import {
  IWallet,
  IWalletAPI,
  IWalletResponse,
  IWalletNonceAPI,
  WalletResponseSchema,
  WalletNonceResponseSchema,
  WalletSchema,
  IWalletGasConfiguration,
  WalletGasConfigurationSchema,
  IWalletGasConfigurationAPI,
  WalletGasConfigurationResponseSchema,
} from '@models/wallet.models';
import { APIError, handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import logger from '@utils/logger';

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

  public async getWalletNonce(url: string): Promise<IWalletNonceAPI> {
    logger.debug(`${this.className}: Getting wallet nonce`);
    try {
      const response = await this.httpClient.get(url);
      return WalletNonceResponseSchema.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async setGasConfiguration(
    url: string,
    data: IWalletGasConfiguration,
  ): Promise<IWalletGasConfigurationAPI> {
    logger.debug(`${this.className}: Setting wallet gas configuration`);
    try {
      const response = await this.httpClient.post(url, data);
      return WalletGasConfigurationResponseSchema.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async updateGasConfiguration(
    url: string,
    data: IWalletGasConfiguration,
  ): Promise<IWalletGasConfigurationAPI> {
    logger.debug(`${this.className}: Updating wallet gas configuration`);
    try {
      const response = await this.httpClient.patch(url, data);
      return WalletGasConfigurationResponseSchema.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async deleteGasConfiguration(
    url: string,
  ): Promise<IWalletGasConfigurationAPI> {
    logger.debug(`${this.className}: Deleting wallet gas configuration`);
    try {
      const response = await this.httpClient.delete(url);
      return WalletGasConfigurationResponseSchema.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async getGasConfiguration(
    url: string,
  ): Promise<IWalletGasConfiguration> {
    logger.debug(`${this.className}: Getting wallet gas configuration`);
    try {
      const response = await this.httpClient.get(url);
      return WalletGasConfigurationSchema.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }
}
