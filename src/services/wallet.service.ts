import { WalletApi } from '@api/wallet.api';
import { Address, ChainId } from '@models/common.models';
import {
  WalletSchemaAPI,
  IWalletAPI,
  IWallet,
  IWallets,
  WalletKeys,
  WalletNonceSchemaAPI,
} from '@models/wallet.models';
import { CustomError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';

export class WalletService {
  private walletApi: WalletApi;

  constructor(httpClient: HttpClient) {
    this.walletApi = new WalletApi(httpClient);
  }

  public async createWallet(data: IWallet): Promise<IWallet> {
    let parsedWalletData: IWalletAPI;
    try {
      parsedWalletData = await WalletSchemaAPI.parse({
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

    return this.walletApi.createWallet(parsedWalletData);
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

  public async getWalletNonce(
    address: Address,
    chainId: ChainId,
  ): Promise<number> {
    const url = '/wallets/:address/chains/:chainId/nonce'
      .replace(':address', address)
      .replace(':chainId', chainId);

    try {
      const data = await this.walletApi.getWalletNonce(url);
      const nonce = await WalletNonceSchemaAPI.parse(data);
      return nonce.nonce;
    } catch (error) {
      throw new CustomError('Failed verify data');
    }
  }
}
