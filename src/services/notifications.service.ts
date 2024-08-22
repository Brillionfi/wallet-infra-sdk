import { NotificationsApi } from '@api/index';
import { Address, ChainId, TNotifications } from '@models/index';
import { handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import logger from 'loglevel';

export class NotificationsService {
  private readonly className: string;
  private notificationsApi: NotificationsApi;

  constructor(httpClient: HttpClient) {
    this.className = this.constructor.name;
    this.notificationsApi = new NotificationsApi(httpClient);
  }

  public async getNotifications(
    address: Address,
    chainId: ChainId,
  ): Promise<TNotifications> {
    logger.info(`${this.className}: Getting notifications`);
    try {
      const transactions = await this.notificationsApi.getTransactions(
        address,
        chainId,
      );
      const notifications =
        await this.notificationsApi.getWalletNotifications();
      return { transactions, notifications };
    } catch (error) {
      throw handleError(error);
    }
  }
}
