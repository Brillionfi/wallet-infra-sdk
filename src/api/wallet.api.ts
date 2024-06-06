import { IWallet } from '@models/wallet.models';
import { HttpClient } from '@utils/http-client';
import logger from '@utils/logger';

export class WalletApi {
  private httpClient: HttpClient;
  url: string;

  constructor(httpClient: HttpClient, url: string) {
    this.httpClient = httpClient;
    this.url = url;
  }

  public async createWallet(data: IWallet): Promise<IWallet> {
    logger.info('Creating wallet');
    const response = await this.httpClient.post(this.url, data);
    return response.data as IWallet;
  }

  public async getWallets(): Promise<IWallet[]> {
    logger.info('Getting wallets');
    // todo error handling
    const response = await this.httpClient.get(this.url);
    return response.data as IWallet[];
  }
}
