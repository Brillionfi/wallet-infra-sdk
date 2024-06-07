import { IWallet, IAPIWallet } from '@models/wallet.models';
import { APIError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import logger from '@utils/logger';

export class WalletApi {
  private httpClient: HttpClient;
  url: string;

  constructor(httpClient: HttpClient, url: string) {
    this.httpClient = httpClient;
    this.url = url;
  }

  public async createWallet(data: IAPIWallet): Promise<IWallet> {
    logger.info('Creating wallet');
    try {
      const response = await this.httpClient.post(this.url, data);
      return response.data as IWallet;
    } catch (error) {
      throw new APIError('Failed to create wallet', 500);
    }
  }

  public async getWallets(): Promise<IWallet[]> {
    logger.info('Getting wallets');
    try {
      const response = await this.httpClient.get(this.url);
      return response.data as IWallet[];
    } catch (error) {
      throw new APIError('Failed to create wallet', 500);
    }
  }
}
