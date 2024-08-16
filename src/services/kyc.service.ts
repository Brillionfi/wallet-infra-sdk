import { IdentityClient, buildSignatureMessage } from '@nexeraid/identity-sdk';
import { KycApi } from '@api/index';
import { ChainId } from '@models/common.models';
import { handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import logger from 'loglevel';
import { WalletService } from './wallet.service';
import {
  IWalletSignTransaction,
  WalletFormats,
  WalletTypes,
} from '@models/wallet.models';

export class KycService {
  private readonly className: string;
  private kycApi: KycApi;
  private walletService: WalletService;
  private identityClient: IdentityClient;

  constructor(httpClient: HttpClient) {
    this.className = this.constructor.name;
    this.kycApi = new KycApi(httpClient);
    this.walletService = new WalletService(httpClient);
    this.identityClient = new IdentityClient();
  }

  public async createKycSession(walletAddress: string, chainId: ChainId) {
    logger.info(`${this.className}: Create KYC Session`);
    try {
      return this.kycApi.generateAccessToken(walletAddress, chainId);
    } catch (error) {
      throw handleError(error);
    }
  }

  public async init(walletAddress: string, chainId: ChainId, origin: string) {
    // Get Access Token
    const publicAddress = walletAddress.toLowerCase();
    const accessToken = await this.kycApi.generateAccessToken(
      publicAddress,
      chainId,
    );

    // Configure the signing callback.
    this.identityClient.onSignMessage(async (data: { message: string }) => {
      const signedResponse = await this.walletService.signTransaction(
        walletAddress,
        {
          walletFormat: WalletFormats.ETHEREUM,
          walletType: WalletTypes.EOA,
          unsignedTransaction: data.message,
        } as IWalletSignTransaction,
        origin,
      );

      if (!signedResponse.signedTransaction) {
        throw new Error('Failed to sign transaction');
      }

      return signedResponse.signedTransaction;
    });

    // Build the signing message and signature
    const signingMessage = buildSignatureMessage(walletAddress.toLowerCase());
    const signature = await this.walletService.signTransaction(
      walletAddress,
      {
        walletFormat: WalletFormats.ETHEREUM,
        walletType: WalletTypes.EOA,
        unsignedTransaction: signingMessage as string,
      } as IWalletSignTransaction,
      origin,
    );

    await this.identityClient.init({
      accessToken,
      signature: signature.signedTransaction as string,
      signingMessage: signingMessage as string,
    });
  }

  public async startVerification() {
    logger.info(`${this.className}: Start Verification`);
    try {
      return this.identityClient.startVerification();
    } catch (error) {
      throw handleError(error);
    }
  }

  public async close() {
    this.identityClient.close();
  }
}
