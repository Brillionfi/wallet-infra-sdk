import { WalletApi } from '@api/wallet.api';
import {
  WalletSchemaAPI,
  IWalletAPI,
  IWallet,
  IWallets,
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
    let creation: IWalletAPI;
    try {
      creation = await WalletSchemaAPI.parse({
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

  public async getWallets(): Promise<IWallet[]> {
    const wallets: IWallets = await this.walletApi.getWallets();
    return wallets.map((wallet) => {
      return {
        [WalletKeys.WALLET_NAME]: wallet.name,
        [WalletKeys.WALLET_TYPE]: wallet.type,
        [WalletKeys.WALLET_FORMAT]: wallet.format,
        [WalletKeys.WALLET_OWNER]: wallet.owner,
        [WalletKeys.WALLET_ADDRESS]: wallet.address,
      };
    });
  }
}
