import { Address } from '@models/common.models';
import {
  IWallet,
  IWalletAPI,
  IWalletResponse,
  WalletResponseSchema,
  WalletSchema,
  IWalletSignTransaction,
  WalletSignTransactionResponseSchema,
  IWalletSignTransactionAPI,
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
}
