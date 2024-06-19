import { TokenApi } from '@api/index';
import { ChainId } from '@models/common.models';
import { IToken } from '@models/token.model';
import { handleError } from '@utils/errors';
import logger from '@utils/logger';

export class TokenService {
  public readonly className: string;
  private tokenApi: TokenApi;

  constructor() {
    this.className = this.constructor.name;
    this.tokenApi = new TokenApi();
  }

  public async getTokens(chainId: ChainId): Promise<IToken[]> {
    logger.info(`${this.className}: Getting all tokens by chain`);
    try {
      return await this.tokenApi.getTokens(chainId);
    } catch (error) {
      throw handleError(error);
    }
  }

  public async getTokenById(
    chainId: ChainId,
    tokenId: string,
  ): Promise<IToken> {
    logger.info(`${this.className}: Getting token by ID`);
    try {
      return await this.tokenApi.getTokenById(chainId, tokenId);
    } catch (error) {
      throw handleError(error);
    }
  }
}
