import { ChainId } from '@models/common.models';
import { APIError, handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import logger from 'loglevel';
import { AxiosResponse } from 'axios';

export class KycApi {
  private readonly className: string;
  private readonly resource: string;
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.resource = 'kyc';
    this.className = this.constructor.name;
    this.httpClient = httpClient;
  }

  public async generateAccessToken(
    walletAddress: string,
    chainId: ChainId,
  ): Promise<string> {
    logger.debug(`${this.className}: Generate access token`);
    try {
      const response: AxiosResponse = await this.httpClient.post(
        `/${this.resource}`,
        {
          walletAddress,
          chainId,
        },
      );

      return response.data.accessToken;
    } catch (error) {
      throw handleError(error as APIError);
    }
  }
}
