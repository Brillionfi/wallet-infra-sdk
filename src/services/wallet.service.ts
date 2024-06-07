import { WalletApi } from '@api/wallet.api';
import {
  APIWalletSchema,
  IAPIWallet,
  IWallet,
  WalletKeys,
} from '@models/wallet.models';
import { CustomError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';

export class WalletService {
  private walletApi: WalletApi;

  constructor(httpClient: HttpClient) {
    this.walletApi = new WalletApi(httpClient, '/wallets');
  }

  public async createWallet(data: IWallet): Promise<IWallet> {
    let creation: IAPIWallet;
    try {
      creation = APIWalletSchema.parse({
        [WalletKeys.WALLET_TYPE]: {
          [data.walletType]: {
            [WalletKeys.WALLET_NAME]: data.walletName,
            [WalletKeys.WALLET_FORMAT]: data.walletFormat,
            [WalletKeys.AUTHENTICATION_TYPE]: data.authenticationType,
          },
        },
      });
    } catch (error) {
      throw new CustomError('Failed verify data');
    }

    return this.walletApi.createWallet(creation);
  }

  public async getExample(): Promise<IWallet[]> {
    return this.walletApi.getWallets();
  }
}
