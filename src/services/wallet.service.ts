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

// import {
//   startAuthentication,
//   startRegistration,
// } from "@simplewebauthn/browser";
// import type {
//   AuthenticationResponseJSON,
//   PublicKeyCredentialCreationOptionsJSON,
//   PublicKeyCredentialRequestOptionsJSON,
//   RegistrationResponseJSON,
// } from "@simplewebauthn/typescript-types";

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
    authType: IAuthenticationTypes,
  ): Promise<IAuthenticationData> {
    try {
      let data: IAuthenticationData;

      switch (authType) {
        case AuthenticationTypes.TURNKEY:
        default:
          // todo exect webauthn

          // const options:PublicKeyCredentialCreationOptionsJSON = await getRegistrationOptions(username); // todo get from api
          // const attestation:RegistrationResponseJSON = await startRegistration(options);
          // const answer:IRegistrationAnswer = await verifyRegistration(attestation, username); // todo verify on api

          data = {
            challenge: 'options.challenge',
            attestation: {
              credentialId: 'attestation.id', // ??
              clientDataJson: 'attestation.response.clientDataJSON',
              attestationObject: 'attestation.response.attestationObject',
              transports: [
                'AUTHENTICATOR_TRANSPORT_HYBRID',
                'AUTHENTICATOR_TRANSPORT_INTERNAL',
              ],
            },
          };

          return data;
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
