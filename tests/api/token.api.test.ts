import { TokenApi } from '@api/index';
import { SUPPORTED_CHAINS } from '@models/common.models';
import { HttpClient } from '@utils/index';
import { AxiosResponse } from 'axios';

jest.mock('@utils/http-client');
jest.mock('@utils/logger', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
}));

describe('Token API', () => {
  let token: TokenApi;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientMock = new HttpClient() as jest.Mocked<HttpClient>;
    token = new TokenApi();
    // eslint-disable-next-line
    (token as any).httpClient = httpClientMock;
  });

  describe('getTokens', () => {
    it('should get all tokens', async () => {
      const response = {
        data: [
          {
            chainId: '1',
            tokenId: '0xTokenId',
            status: 'Active',
            name: 'TokenName',
            address: '0xTokenAddress',
            type: 'ERC20',
            symbol: 'TKN',
            decimals: 18,
            logo: 'https://token-logo.png',
            contractABI: '',
            createdAt: '',
            updatedAt: '',
            updatedBy: '',
          },
        ],
      };

      httpClientMock.get.mockResolvedValue(response as AxiosResponse);

      const result = await token.getTokens(SUPPORTED_CHAINS.ETHEREUM);
      expect(httpClientMock.get).toHaveBeenCalledWith('/tokens/1');
      expect(result).toEqual(response.data);
    });

    it('should throw error when failed to get all tokens', async () => {
      httpClientMock.get.mockRejectedValue(new Error('API Error'));
      await expect(token.getTokens(SUPPORTED_CHAINS.ETHEREUM)).rejects.toThrow(
        'API Error',
      );
    });
  });

  describe('getTokenById', () => {
    it('should get token by ID', async () => {
      const response = {
        data: {
          chainId: '1',
          tokenId: '0xTokenId',
          status: 'Active',
          name: 'TokenName',
          address: '0xTokenAddress',
          type: 'ERC20',
          symbol: 'TKN',
          decimals: 18,
          logo: 'https://token-logo.png',
          contractABI: '',
          createdAt: '',
          updatedAt: '',
          updatedBy: '',
        },
      };

      httpClientMock.get.mockResolvedValue(response as AxiosResponse);
      const result = await token.getTokenById(
        SUPPORTED_CHAINS.ETHEREUM,
        '0xTokenId',
      );
      expect(httpClientMock.get).toHaveBeenCalledWith('/tokens/1/0xTokenId');
      expect(result).toEqual(response.data);
    });

    it('should throw error when failed to get token by ID', async () => {
      httpClientMock.get.mockRejectedValue(new Error('API Error'));
      await expect(
        token.getTokenById(SUPPORTED_CHAINS.ETHEREUM, '0xTokenId'),
      ).rejects.toThrow('API Error');
    });
  });
});
