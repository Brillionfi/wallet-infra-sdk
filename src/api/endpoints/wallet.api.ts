import {
  TCreateWalletBody,
  TCreateWalletResponse,
  TGetWalletsResponse,
} from '@models/wallet';
import { HttpClient } from '@utils/http-client';
import logger from '@utils/logger';

export class Wallet {
  private httpClient: HttpClient;
  url: string;

  constructor(httpClient: HttpClient, url: string) {
    this.httpClient = httpClient;
    this.url = url;
  }

  public async createWallet(
    data: TCreateWalletBody,
  ): Promise<TCreateWalletResponse> {
    logger.info('Creating wallet');
    const response = await this.httpClient.post(this.url, data);
    return response.data as TCreateWalletResponse;
  }

  public async getWallets(): Promise<TGetWalletsResponse> {
    logger.info('Getting wallets');
    const response = await this.httpClient.get(this.url);
    return response.data as TGetWalletsResponse;
  }
}
