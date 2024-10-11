import { ChainId } from '@models/common.models';
import { IToken, TokenSchema } from '@models/token.model';
import { APIError, handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import logger from 'loglevel';
import { AxiosResponse } from 'axios';

export class TokenApi {
  private readonly className: string;
  private readonly resource: string;
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.resource = 'tokens';
    this.className = this.constructor.name;
    this.httpClient = httpClient;
  }

  public async getTokens(chainId: ChainId): Promise<IToken[]> {
    logger.debug(`${this.className}: Get all tokens by chain`);
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `/chains/${chainId}/tokens-list`,
      );

      return TokenSchema.array().parse(response.data.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }
  public async getTokenBySymbol(
    chainId: ChainId,
    symbol: string,
  ): Promise<IToken> {
    logger.debug(`${this.className}: Get all tokens by chain and symbol`);
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `/chains/${chainId}/tokens/${symbol}`,
      );

      return TokenSchema.parse(response.data.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }
}
