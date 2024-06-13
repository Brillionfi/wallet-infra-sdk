import { WalletApi } from '@api/wallet.api';
import {
  WalletSchemaAPI,
  IWalletAPI,
  IWallet,
  WalletKeys,
  IWalletResponse,
  IAuthenticationTypes,
  AuthenticationTypes,
  IAuthenticationData,
} from '@models/wallet.models';
import { CustomError, handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import logger from '@utils/logger';
import { getWebAuthnAttestation } from '@turnkey/http';
import { base64UrlEncode, generateRandomBuffer } from '@utils/common';

export class WalletService {
  private readonly className: string;
  private walletApi: WalletApi;

  constructor(httpClient: HttpClient) {
    this.className = this.constructor.name;
    this.walletApi = new WalletApi(httpClient);
  }

  public async createWallet(data: IWallet): Promise<IWallet> {
    logger.info(`${this.className}: Creating wallet`);
    try {
      const parsedWalletData = await this.parseCreateWalletData(data);
      const createdWallet = await this.walletApi.createWallet(parsedWalletData);
      const parsedWallet = this.parseCreateWalletResponse(createdWallet);

      return parsedWallet;
    } catch (error) {
      throw handleError(error);
    }
  }

  public async getWallets(): Promise<IWallet[]> {
    logger.info(`${this.className}: Getting Wallets`);
    try {
      const wallets: IWallet[] = await this.walletApi.getWallets();
      return wallets;
    } catch (error) {
      throw handleError(error);
    }
  }

  private async parseCreateWalletData(data: IWallet): Promise<IWalletAPI> {
    try {
      if (!data[WalletKeys.AUTHENTICATION_TYPE])
        throw new CustomError('Failed to parse create wallet data');

      const authentication = await this.generateAuthenticationData(
        data[WalletKeys.NAME],
        data[WalletKeys.AUTHENTICATION_TYPE],
      );

      return WalletSchemaAPI.parse({
        walletType: {
          [data[WalletKeys.TYPE]]: {
            walletName: data[WalletKeys.NAME],
            walletFormat: data[WalletKeys.FORMAT],
            authenticationType: authentication,
          },
        },
      });
    } catch (error) {
      throw new CustomError('Failed to parse create wallet data');
    }
  }

  private async generateAuthenticationData(
    walletName: string,
    authType: IAuthenticationTypes,
  ): Promise<IAuthenticationData> {
    try {
      let challenge: ArrayBuffer;
      let authenticatorUserId: ArrayBuffer;
      let attestation;

      switch (authType) {
        case AuthenticationTypes.TURNKEY:
        default:
          challenge = generateRandomBuffer();
          authenticatorUserId = generateRandomBuffer();

          attestation = await getWebAuthnAttestation({
            publicKey: {
              rp: {
                id: 'Brillion-wallet-infra',
                name: 'Turnkey Federated Passkey Demo',
              },
              challenge,
              pubKeyCredParams: [
                {
                  type: 'public-key',
                  alg: -7,
                },
              ],
              user: {
                id: authenticatorUserId,
                name: walletName,
                displayName: walletName,
              },
            },
          });

          return {
            challenge: base64UrlEncode(challenge),
            attestation,
          };
      }
    } catch (error) {
      throw new CustomError('Failed to create authentication data');
    }
  }

  private parseCreateWalletResponse(data: IWalletResponse): IWallet {
    try {
      const walletTypeKey = Object.keys(data)[0];
      const walletData = data[walletTypeKey];

      return {
        [WalletKeys.TYPE]: walletData.walletType,
        [WalletKeys.ADDRESS]: walletData.walletAddress,
        [WalletKeys.FORMAT]: walletData.walletFormat,
        [WalletKeys.NAME]: walletData.walletName,
      };
    } catch (error) {
      throw new CustomError('Failed to create wallet response');
    }
  }
}
