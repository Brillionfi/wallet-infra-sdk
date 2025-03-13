import { NotificationsApi } from '@api/index';
import { TWalletActivities } from '@models/index';
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

  public async getNotifications(): Promise<TWalletActivities> {
    logger.info(`${this.className}: Getting notifications`);
    try {
      return await this.notificationsApi.getWalletNotifications();
    } catch (error) {
      throw handleError(error);
    }
  }
}
