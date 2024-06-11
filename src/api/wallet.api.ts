import {
  IWallet,
  IWalletAPI,
  IWalletResponse,
  IWalletNonceAPI,
  WalletResponseSchema,
  WalletSchema,
} from '@models/wallet.models';
import { APIError, handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import logger from '@utils/logger';

export class WalletApi {
  private readonly className: string;
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.className = this.constructor.name;
    this.httpClient = httpClient;
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
      throw handleError(error);
    }
  }

  public async getWalletNonce(url: string): Promise<IWalletNonceAPI> {
    logger.info('Getting wallet nonce');
    try {
      const response = await this.httpClient.get(url);
      return response.data as IWalletNonceAPI;
    } catch (error) {
      throw new APIError(
        'Failed to get wallet nonce ' + (error as Error).message,
        500,
      );
    }
  }
}
