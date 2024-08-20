import { NotificationsApi } from '@api/notifications.api';
import { ChainId, SUPPORTED_CHAINS } from '@models/common.models';
import { EActivityLevel, EActivityStatus } from '@models/notifications.model';
import { HttpClient } from '@utils/http-client';
import { AxiosResponse } from 'axios';

jest.mock('@utils/http-client');
jest.mock('loglevel', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
}));

describe('Notifications API', () => {
  let notificationsApi: NotificationsApi;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientMock = new HttpClient('') as jest.Mocked<HttpClient>;
    notificationsApi = new NotificationsApi(new HttpClient(''));
    // eslint-disable-next-line
    (notificationsApi as any).httpClient = httpClientMock;
  });

  it('should get transactions', async () => {
    const response = {
      data: [
        {
          blockHash: '',
          blockNumber: '',
          contractAddress: '',
          cumulativeGasUsed: '',
          effectiveGasPrice: '',
          from: '',
          gasUsed: '',
          logsBloom: '',
          status: '',
          to: '',
          transactionHash: '',
          transactionIndex: '',
          type: '',
        },
      ],
    };

    httpClientMock.get.mockResolvedValue(response as AxiosResponse);

    const result = await notificationsApi.getTransactions(
      'walletAddress',
      '1' as ChainId,
    );

    expect(httpClientMock.get).toHaveBeenCalledWith(
      '/wallets/walletAddress/chains/1/transactions',
    );
    expect(result).toEqual(response.data);
  });

  it('should get wallet notifications', async () => {
    const response = {
      data: [
        {
          id: '',
          fingerprint: '',
          organizationId: '',
          type: '',
          status: '',
          createdAt: '',
          updatedAt: '',
          canApprove: true,
          canReject: true,
          intent: {},
          notificationLevel: EActivityLevel.INFO,
          notificationStatus: EActivityStatus.NOT_READ,
        },
      ],
    };

    httpClientMock.get.mockResolvedValue(response as AxiosResponse);

    const result = await notificationsApi.getWalletNotifications();

    expect(httpClientMock.get).toHaveBeenCalledWith('/wallets/notifications');
    expect(result).toEqual(response.data);
  });

  it('should mark transactions as read', async () => {
    const mockedPut = jest
      .spyOn(httpClientMock, 'put')
      .mockResolvedValueOnce({ data: null } as AxiosResponse);

    await notificationsApi.markTransactionsAsRead(
      '1',
      SUPPORTED_CHAINS.ETHEREUM,
      '0x0',
    );

    expect(mockedPut).toHaveBeenCalledWith('/wallets', {
      blockNumber: '0x0',
      eoa: '1',
      chainId: SUPPORTED_CHAINS.ETHEREUM,
    });
  });

  it('should mark wallet notifications as read', async () => {
    const mockedPut = jest
      .spyOn(httpClientMock, 'put')
      .mockResolvedValueOnce({ data: null } as AxiosResponse);

    await notificationsApi.markWalletNotificationsAsRead('1', ['0x0']);

    expect(mockedPut).toHaveBeenCalledWith('/wallets', {
      notificationIds: ['0x0'],
      eoa: '1',
    });
  });
});
