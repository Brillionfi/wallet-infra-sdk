import { Address, ChainId } from '@models/common.models';
import {
  IWalletTransaction,
  IWallet,
  IWalletAPI,
  IWalletResponse,
  WalletResponseSchema,
  WalletSchema,
  WalletTransactionSchema,
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
      throw handleError(error);
    }
  }

  public async getTransactionHistory(
    address: Address,
    chainId: ChainId,
  ): Promise<IWalletTransaction[]> {
    logger.debug(`${this.className}: Getting Wallets`);
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `wallets/${address}/chains/${chainId}/transactions`,
      );
      const wallets = WalletTransactionSchema.array().parse(response.data);
      return wallets;
    } catch (error) {
      throw handleError(error);
    }
  }
}
