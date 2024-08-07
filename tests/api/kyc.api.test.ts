import { KycApi } from '@api/kyc.api';
import { ChainId } from '@models/common.models';
import { HttpClient } from '@utils/http-client';
import { AxiosResponse } from 'axios';

jest.mock('@utils/http-client');
jest.mock('loglevel', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
}));

describe('KYC API', () => {
  let kycApi: KycApi;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientMock = new HttpClient('') as jest.Mocked<HttpClient>;
    kycApi = new KycApi(new HttpClient(''));
    // eslint-disable-next-line
    (kycApi as any).httpClient = httpClientMock;
  });

  describe('generateAccessToken', () => {
    it('should generate access token', async () => {
      const response = {
        data: {
          accessToken: 'accessToken',
        },
      };

      httpClientMock.post.mockResolvedValue(response as AxiosResponse);

      const result = await kycApi.generateAccessToken(
        'walletAddress',
        '1' as ChainId,
      );

      expect(httpClientMock.post).toHaveBeenCalledWith('/kyc/access-token', {
        walletAddress: 'walletAddress',
        chainId: '1',
      });
      expect(result).toEqual(response.data.accessToken);
    });
  });

  it('should throw error when failed to generate access token', async () => {
    httpClientMock.post.mockRejectedValue(new Error('API Error'));
    await expect(
      kycApi.generateAccessToken('walletAddress', '1' as ChainId),
    ).rejects.toThrow('API Error');
  });
});
