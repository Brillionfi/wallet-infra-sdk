import { TokenService } from '@services/token.service';
import { TokenApi } from '@api/token.api';
import { ChainId, SUPPORTED_CHAINS } from '@models/common.models';
import { TokenStatusKeys, TokenTypeKeys } from '@models/token.model';
import { HttpClient } from '@utils/http-client';

jest.mock('@api/token.api');
jest.mock('@utils/http-client');
jest.mock('loglevel', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
}));

describe('TokenService', () => {
  let tokenApi: jest.Mocked<TokenApi>;
  let tokenService: TokenService;

  beforeEach(() => {
    tokenApi = new TokenApi(new HttpClient('')) as jest.Mocked<TokenApi>;

    (TokenApi as jest.Mock<TokenApi>).mockImplementation(() => tokenApi);

    tokenService = new TokenService(new HttpClient(''));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTokens', () => {
    it('should get all tokens by chain', async () => {
      const tokens = [
        {
          chainId: '1' as ChainId,
          tokenId: '0xTokenId',
          status: TokenStatusKeys.ACTIVE,
          name: 'TokenName',
          address: '0xTokenAddress',
          type: TokenTypeKeys.ERC20,
          symbol: 'TKN',
          decimals: 18,
          logo: 'https://token-logo.png',
          contractABI: '',
          createdAt: '',
          updatedAt: '',
          updatedBy: '',
        },
      ];

      tokenApi.getTokens = jest.fn().mockResolvedValue(tokens);

      const result = await tokenService.getTokens(SUPPORTED_CHAINS.ETHEREUM);
      expect(tokenApi.getTokens).toHaveBeenCalledWith(
        SUPPORTED_CHAINS.ETHEREUM,
      );
      expect(result).toEqual(tokens);
    });

    it('should throw error when failed to get all tokens by chain', async () => {
      tokenApi.getTokens = jest.fn().mockRejectedValue(new Error('API Error'));

      await expect(
        tokenService.getTokens(SUPPORTED_CHAINS.ETHEREUM),
      ).rejects.toThrowError('API Error');
    });
  });
});
