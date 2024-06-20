import { WalletApi } from '@api/wallet.api';
import { Address, ChainId } from '@models/common.models';
import {
  WalletSchemaAPI,
  IWalletAPI,
  IWallet,
  IWalletResponse,
  IAuthenticationTypes,
  AuthenticationTypes,
  IAuthenticationData,
  WalletKeys,
  IWalletGasConfiguration,
  IWalletGasConfigurationAPI,
  WalletNonceResponseSchema,
} from '@models/wallet.models';
import { CustomError, handleError } from '@utils/errors';
import logger from '@utils/logger';
import { getWebAuthnAttestation } from '@turnkey/http';
import { base64UrlEncode, generateRandomBuffer } from '@utils/common';
import { AxiosError, HttpStatusCode } from 'axios';

export class WalletService {
  private readonly className: string;
  private walletApi: WalletApi;

  constructor() {
    this.className = this.constructor.name;
    this.walletApi = new WalletApi();
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

  public async getGasConfig(
    address: Address,
    chainId: ChainId,
  ): Promise<IWalletGasConfiguration> {
    logger.info(`${this.className}: Getting Wallet gas configuration`);
    try {
      return await this.walletApi.getGasConfig(address, chainId);
    } catch (error) {
      throw handleError(error);
    }
  }

  public async setGasConfig(
    address: Address,
    chainId: ChainId,
    configuration: IWalletGasConfiguration,
  ): Promise<IWalletGasConfigurationAPI> {
    logger.info(`${this.className}: Setting Wallet gas configuration`);

    try {
      // delete gas configuration if all values are 0
      if (
        parseInt(configuration.gasLimit) === 0 &&
        parseInt(configuration.maxFeePerGas) === 0 &&
        parseInt(configuration.maxPriorityFeePerGas) === 0
      ) {
        return await this.walletApi.deleteGasConfig(address, chainId);
      } else {
        // update if gas configuration already exists
        await this.walletApi.getGasConfig(address, chainId);
        return await this.walletApi.updateGasConfig(
          address,
          chainId,
          configuration,
        );
      }
    } catch (error) {
      // if not found create new gas configuration
      if (
        error instanceof AxiosError &&
        error.response?.status === HttpStatusCode.NotFound
      ) {
        return await this.walletApi.createGasConfig(
          address,
          chainId,
          configuration,
        );
      } else {
        throw handleError(error);
      }
    }
  }

  public async getNonce(address: Address, chainId: ChainId): Promise<number> {
    try {
      const data = await this.walletApi.getNonce(address, chainId);
      const nonce = await WalletNonceResponseSchema.parse(data);
      return nonce.nonce;
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
          [data[WalletKeys.TYPE].toLocaleLowerCase()]: {
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
