import { ChainId } from '@models/common.models';
import { IToken, TokenSchema } from '@models/token.model';
import { APIError, handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import logger from '@utils/logger';
import { AxiosResponse } from 'axios';

export class TokenApi {
  private readonly className: string;
  private readonly resource: string;
  private httpClient: HttpClient;

  constructor() {
    this.resource = 'tokens';
    this.className = this.constructor.name;
    this.httpClient = new HttpClient();
  }

  public async getTokens(chainId: ChainId): Promise<IToken[]> {
    logger.debug(`${this.className}: Get all tokens by chain`);
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `/${this.resource}/${chainId}`,
      );

      return TokenSchema.array().parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async getTokenById(
    chainId: ChainId,
    tokenId: string,
  ): Promise<IToken> {
    logger.debug(`${this.className}: Get token by ID`);
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `/${this.resource}/${chainId}/${tokenId}`,
      );

      return TokenSchema.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }
}
