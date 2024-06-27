import { TokenApi } from '@api/index';
import { ChainId } from '@models/common.models';
import { IToken } from '@models/token.model';
import { handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import logger from '@utils/logger';

export class TokenService {
  public readonly className: string;
  private tokenApi: TokenApi;

  constructor(httpClient: HttpClient) {
    this.className = this.constructor.name;
    this.tokenApi = new TokenApi(httpClient);
  }

  public async getTokens(chainId: ChainId): Promise<IToken[]> {
    logger.info(`${this.className}: Getting all tokens by chain`);
    try {
      return await this.tokenApi.getTokens(chainId);
    } catch (error) {
      throw handleError(error);
    }
  }
}
