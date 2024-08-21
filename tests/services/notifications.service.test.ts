import { NotificationsService } from '@services/notifications.service';
import { NotificationsApi } from '@api/notifications.api';
import { SUPPORTED_CHAINS } from '@models/common.models';
import { HttpClient } from '@utils/http-client';
import {
  EActivityLevel,
  EActivityStatus,
  TEvmReceiptsBody,
  TWalletActivities,
} from '@models/notifications.model';

jest.mock('@api/notifications.api');
jest.mock('@utils/http-client');
jest.mock('loglevel', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
}));

describe('NotificationsService', () => {
  let notificationsApi: jest.Mocked<NotificationsApi>;
  let notificationsService: NotificationsService;

  beforeEach(() => {
    notificationsApi = new NotificationsApi(
      new HttpClient(''),
    ) as jest.Mocked<NotificationsApi>;

    (NotificationsApi as jest.Mock<NotificationsApi>).mockImplementation(
      () => notificationsApi,
    );

    notificationsService = new NotificationsService(new HttpClient(''));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all notifications', async () => {
    const transactions: TEvmReceiptsBody = [
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
    ];
    const notifications: TWalletActivities = [
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
    ];

    notificationsApi.getTransactions = jest
      .fn()
      .mockResolvedValue(transactions);
    notificationsApi.getWalletNotifications = jest
      .fn()
      .mockResolvedValue(notifications);

    const result = await notificationsService.getNotifications(
      '0x1',
      SUPPORTED_CHAINS.ETHEREUM,
    );
    expect(notificationsApi.getTransactions).toHaveBeenCalledWith(
      '0x1',
      SUPPORTED_CHAINS.ETHEREUM,
    );
    expect(notificationsApi.getWalletNotifications).toHaveBeenCalled();
    expect(result).toStrictEqual({ transactions, notifications });
  });
});
