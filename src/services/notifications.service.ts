import { NotificationsApi } from '@api/index';
import { Address, ChainId, SUPPORTED_CHAINS } from '@models/index';
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

  public async getNotifications(address: Address, chainId: ChainId) {
    logger.info(`${this.className}: Getting notifications`);
    try {
      const transactions = await this.notificationsApi.getTransactions(
        address,
        chainId,
      );
      const walletNotifications =
        await this.notificationsApi.getWalletNotifications();
      return [...transactions, ...walletNotifications];
    } catch (error) {
      throw handleError(error);
    }
  }

  public async markNotificationsAsRead(
    address: Address,
    hashes: string[],
    chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM,
    blockNumber: string = '0x0',
  ) {
    logger.info(`${this.className}: Getting notifications`);
    try {
      await this.notificationsApi.markTransactionsAsRead(
        address,
        chainId,
        blockNumber,
      );
      await this.notificationsApi.markWalletNotificationsAsRead(
        address,
        hashes,
      );
    } catch (error) {
      throw handleError(error);
    }
  }
}
