import { WalletApi } from '@api/wallet.api';
import { IWallet } from '@models/wallet.models';
import { HttpClient } from '@utils/http-client';

export class WalletService {
  private walletApi: WalletApi;

  constructor(httpClient: HttpClient) {
    this.walletApi = new WalletApi(httpClient, '/wallets');
  }

  public async createWallet(data: IWallet): Promise<IWallet> {
    return this.walletApi.createWallet(data);
  }

  public async getExample(): Promise<IWallet[]> {
    return this.walletApi.getWallets();
  }
}
