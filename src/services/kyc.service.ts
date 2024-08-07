import { IdentityClient, buildSignatureMessage } from '@nexeraid/identity-sdk';
import { useSignMessage } from 'wagmi';
import { KycApi } from '@api/index';
import { ChainId } from '@models/common.models';
import { handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import logger from 'loglevel';

export class KycService {
  private readonly className: string;
  private kycApi: KycApi;
  private identityClient: IdentityClient;

  constructor(httpClient: HttpClient) {
    this.className = this.constructor.name;
    this.kycApi = new KycApi(httpClient);
    this.identityClient = new IdentityClient();
  }

  public async init(walletAddress: string, chainId: ChainId) {
    const { signMessageAsync } = useSignMessage();

    // Get Access Token
    const publicAddress = walletAddress.toLowerCase();
    const accessToken = await this.kycApi.generateAccessToken(
      publicAddress,
      chainId,
    );

    // Configure the signing callback.
    this.identityClient.onSignMessage(async (data: { message: string }) => {
      return await signMessageAsync({ message: data.message });
    });

    // Build the signing message and signature
    const signingMessage = buildSignatureMessage(walletAddress.toLowerCase());
    const signature = await signMessageAsync({ message: signingMessage });

    return await this.identityClient.init({
      accessToken,
      signature: signature,
      signingMessage: signingMessage,
    });
  }

  public async startVerification() {
    logger.info(`${this.className}: Start Verification`);
    try {
      return await this.identityClient.startVerification();
    } catch (error) {
      throw handleError(error);
    }
  }

  public async close() {
    this.identityClient.close();
  }
}
