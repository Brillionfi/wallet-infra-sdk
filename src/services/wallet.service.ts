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
  IWalletNotifications,
  IExecRecovery,
  IWalletSignTransactionResponse,
  IWalletGasEstimation,
} from '@models/wallet.models';
import { CustomError, handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import logger from 'loglevel';
import { AxiosError, HttpStatusCode } from 'axios';
import { BundleStamper } from '@utils/stampers';
import { base64UrlEncode, generateRandomBuffer } from '@utils/common';
import { WebauthnStamper } from '@utils/stampers/webAuthnStamper';
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
      const wallets: IWalletResponse[] = await this.walletApi.getWallets();
      return wallets.map((wallet: IWalletResponse) =>
        this.parseCreateWalletResponse(wallet),
      );
    } catch (error) {
      throw handleError(error);
    }
  }

  public async signTransaction(
    address: Address,
    data: IWalletSignTransaction,
    fromOrigin: string,
  ): Promise<IWalletSignTransactionResponse> {
    logger.info(`${this.className}: Setting Wallet gas configuration`);

    try {
      const response = await this.walletApi.signTransaction(address, data);

      if (response.needsApproval) {
        const stamper = new WebauthnStamper({
          rpId: fromOrigin,
        });
        const timestamp = Date.now().toString();
        const requestBody = {
          type: 'ACTIVITY_TYPE_APPROVE_ACTIVITY',
          timestampMs: timestamp,
          organizationId: response.organizationId,
          parameters: {
            fingerprint: response.fingerprint,
          },
        };

        const stamped = await stamper.stamp(JSON.stringify(requestBody));

        return await this.walletApi.approveSignTransaction({
          address,
          timestamp,
          organizationId: response.organizationId,
          fingerprint: response.fingerprint,
          stamped,
        });
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
    page = 0,
  ): Promise<{ transactions: Partial<ITransaction>[]; currentPage: number }> {
    logger.info(`${this.className}: Getting Wallet transaction history`);
    try {
      return await this.walletApi.getTransactionHistory(address, chainId, page);
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

  public async getGasFees(
    chainId: ChainId,
    from: Address,
    to: Address,
    value: string,
    data: string,
  ): Promise<IWalletGasEstimation> {
    logger.info(`${this.className}: Getting Wallet gas estimation`);
    try {
      return await this.walletApi.getGasFees({
        chainId,
        from,
        to,
        value,
        data,
      });
    } catch (error) {
      throw handleError(error);
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

  public async initRecovery(address: string): Promise<IWalletRecovery> {
    logger.info(`${this.className}: Wallet recovery initiated`);
    try {
      await this.bundleStamper.init();
      return await this.walletApi.recover(
        this.bundleStamper.publicKey(),
        address,
      );
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
  ): Promise<IExecRecovery> {
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

      const authenticator = {
        authenticatorName: passkeyName,
        challenge: base64UrlEncode(challenge),
        attestation: attestation,
      };

      const timestamp = Date.now().toString();

      const requestBody = {
        type: 'ACTIVITY_TYPE_RECOVER_USER',
        timestampMs: timestamp,
        organizationId,
        parameters: {
          userId,
          authenticator,
        },
      };

      const stamped = await this.bundleStamper.stamp(
        JSON.stringify(requestBody),
      );

      return await this.walletApi.execRecover({
        timestamp,
        organizationId,
        userId,
        authenticator,
        stamped,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  public async approveTransaction(
    address: string,
    organizationId: string,
    fingerprint: string,
    fromOrigin: string,
  ): Promise<IWalletSignTransactionResponse> {
    try {
      const stamper = new WebauthnStamper({
        rpId: fromOrigin,
      });

      const timestamp = Date.now().toString();
      const requestBody = {
        type: 'ACTIVITY_TYPE_APPROVE_ACTIVITY',
        timestampMs: timestamp,
        organizationId,
        parameters: {
          fingerprint,
        },
      };

      const stamped = await stamper.stamp(JSON.stringify(requestBody));

      return await this.walletApi.approveSignTransaction({
        address,
        timestamp,
        organizationId,
        fingerprint,
        stamped,
      });
    } catch (error) {
      throw new CustomError('Failed to make a decision');
    }
  }

  public async rejectTransaction(
    address: string,
    organizationId: string,
    fingerprint: string,
    fromOrigin: string,
  ): Promise<IWalletSignTransactionResponse> {
    try {
      const stamper = new WebauthnStamper({
        rpId: fromOrigin,
      });

      const timestamp = Date.now().toString();
      const requestBody = {
        type: 'ACTIVITY_TYPE_REJECT_ACTIVITY',
        timestampMs: timestamp,
        organizationId,
        parameters: {
          fingerprint,
        },
      };
      const stamped = await stamper.stamp(JSON.stringify(requestBody));

      return await this.walletApi.rejectSignTransaction({
        address,
        timestamp,
        organizationId,
        fingerprint,
        stamped,
      });
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
        walletName: data[WalletKeys.NAME],
        walletFormat: data[WalletKeys.FORMAT],
        signer: {
          authentication: data[WalletKeys.AUTHENTICATION],
        },
      });
    } catch (error) {
      throw new CustomError('Failed to parse create wallet data');
    }
  }

  private parseCreateWalletResponse(data: IWalletResponse): IWallet {
    try {
      const walletData = data;

      return {
        [WalletKeys.TYPE]: walletData.type,
        [WalletKeys.ADDRESS]: walletData.address,
        [WalletKeys.FORMAT]: walletData.signer.format,
        [WalletKeys.NAME]: walletData.name,
        [WalletKeys.SIGNER]: walletData.signer.address,
      };
    } catch (error) {
      throw new CustomError('Failed to create wallet response');
    }
  }
}
