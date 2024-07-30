import { WalletApi } from '@api/wallet.api';
import { Address, ChainId } from '@models/common.models';
import { ITransaction } from '@models/transaction.models';
import {
  WalletSchemaAPI,
  IWalletAPI,
  IWallet,
  IWalletResponse,
  WalletKeys,
  IWalletSignTransaction,
  IWalletGasConfiguration,
  IWalletGasConfigurationAPI,
  WalletNonceResponseSchema,
  IWalletRecovery,
  IWalletPortfolio,
  IWalletSignTransactionService,
  IWalletNotifications,
  ITurnkeyWalletActivity,
} from '@models/wallet.models';
import { CustomError, handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import logger from 'loglevel';
import { AxiosError, HttpStatusCode } from 'axios';
import { BundleStamper } from '@utils/stampers';
import { base64UrlEncode, generateRandomBuffer } from '@utils/common';
import { WebauthnStamper } from '@utils/stampers/webAuthnStamper';
import {
  ApproveActivityInTurnkey,
  RecoverUserInTurnkey,
  RejectActivityInTurnkey,
} from '@utils/turnkey';
import { create as webAuthCreation } from '@utils/stampers/webAuthnStamper/webauthn-json/api';

export class WalletService {
  private readonly className: string;
  private walletApi: WalletApi;
  private bundleStamper: BundleStamper;

  constructor(httpClient: HttpClient) {
    this.className = this.constructor.name;
    this.walletApi = new WalletApi(httpClient);
    this.bundleStamper = new BundleStamper();
  }

  public async createWallet(data: IWallet): Promise<IWallet> {
    logger.info(`${this.className}: Creating wallet`);
    try {
      const parsedWalletData = this.parseCreateWalletData(data);
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

  public async signTransaction(
    address: Address,
    data: IWalletSignTransaction,
    fromOrigin: string,
  ): Promise<IWalletSignTransactionService> {
    logger.info(`${this.className}: Setting Wallet gas configuration`);

    try {
      const { data: response } = await this.walletApi.signTransaction(
        address,
        data,
      );

      if (response.needsApproval) {
        const stamper = new WebauthnStamper({
          rpId: fromOrigin,
        });

        const activity = await ApproveActivityInTurnkey(
          response.organizationId,
          response.fingerprint,
          stamper,
        );

        return {
          ...response,
          signedTransaction:
            activity.result?.signTransactionResult?.signedTransaction,
        };
      } else {
        return response;
      }
    } catch (error) {
      throw new CustomError('Failed verify data');
    }
  }

  public async getTransactionHistory(
    address: Address,
    chainId: ChainId,
  ): Promise<ITransaction[]> {
    logger.info(`${this.className}: Getting Wallet transaction history`);
    try {
      return await this.walletApi.getTransactionHistory(address, chainId);
    } catch (error) {
      throw handleError(error);
    }
  }

  public async getPortfolio(
    address: Address,
    chainId: ChainId,
  ): Promise<IWalletPortfolio> {
    logger.info(`${this.className}: Getting Wallet portfolio`);
    try {
      return await this.walletApi.getPortfolio(address, chainId);
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

  public async initRecovery(): Promise<IWalletRecovery> {
    logger.info(`${this.className}: Wallet recovery initiated`);
    try {
      await this.bundleStamper.init();
      return await this.walletApi.recover(this.bundleStamper.publicKey());
    } catch (error) {
      throw handleError(error);
    }
  }

  public async execRecovery(
    organizationId: string,
    userId: string,
    passkeyName: string,
    bundle: string,
    fromOrigin: string,
  ): Promise<IWalletRecovery> {
    logger.info(`${this.className}: Wallet recovery executed`);
    try {
      await this.bundleStamper.injectCredentialBundle(bundle);
      const challenge = generateRandomBuffer();
      const authenticatorUserId = generateRandomBuffer();

      const assertion = await webAuthCreation({
        publicKey: {
          authenticatorSelection: {
            residentKey: 'preferred',
            requireResidentKey: false,
            userVerification: 'preferred',
          },
          rp: {
            id: fromOrigin,
            name: 'Brillion Passkey',
          },
          challenge: base64UrlEncode(challenge),
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },
            { type: 'public-key', alg: -257 },
          ],
          user: {
            id: base64UrlEncode(authenticatorUserId),
            name: passkeyName,
            displayName: passkeyName,
          },
        },
      });

      const attestation = {
        credentialId: assertion.id,
        clientDataJson: assertion.response.clientDataJSON,
        attestationObject: assertion.response.attestationObject,
        transports: assertion.response.transports.map(
          (arg) => 'AUTHENTICATOR_TRANSPORT_' + arg.toUpperCase(),
        ),
      };

      const activity = await RecoverUserInTurnkey(
        organizationId,
        userId,
        {
          authenticatorName: passkeyName,
          challenge: base64UrlEncode(challenge),
          attestation: attestation,
        },
        this.bundleStamper,
      );

      return {
        eoa: {
          organizationId,
          userId,
          needsApproval: activity.status === 'ACTIVITY_STATUS_CONSENSUS_NEEDED',
          fingerprint: activity.fingerprint,
          activityId: activity.id,
        },
      };
    } catch (error) {
      throw handleError(error);
    }
  }

  public async approveOrRejectActivity(
    organizationId: string,
    fingerprint: string,
    decision: boolean,
    fromOrigin: string,
  ): Promise<ITurnkeyWalletActivity> {
    try {
      const stamper = new WebauthnStamper({
        rpId: fromOrigin,
      });

      if (decision) {
        return await ApproveActivityInTurnkey(
          organizationId,
          fingerprint,
          stamper,
        );
      } else {
        return await RejectActivityInTurnkey(
          organizationId,
          fingerprint,
          stamper,
        );
      }
    } catch (error) {
      throw new CustomError('Failed to make a decision');
    }
  }

  public async getNotifications(): Promise<IWalletNotifications> {
    logger.info(`${this.className}: Getting Wallet notifications`);
    try {
      return await this.walletApi.getNotifications();
    } catch (error) {
      throw handleError(error);
    }
  }

  private parseCreateWalletData(data: IWallet): IWalletAPI {
    try {
      return WalletSchemaAPI.parse({
        walletType: {
          [data[WalletKeys.TYPE].toLocaleLowerCase()]: {
            walletName: data[WalletKeys.NAME],
            walletFormat: data[WalletKeys.FORMAT],
            authenticationType: data[WalletKeys.AUTHENTICATION_TYPE],
          },
        },
      });
    } catch (error) {
      throw new CustomError('Failed to parse create wallet data');
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
        [WalletKeys.AUTHENTICATION_TYPE]: walletData.authenticationType,
      };
    } catch (error) {
      throw new CustomError('Failed to create wallet response');
    }
  }
}
