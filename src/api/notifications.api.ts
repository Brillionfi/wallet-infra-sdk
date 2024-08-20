import { Address, ChainId } from '@models/common.models';
import {
  EvmReceiptsBodySchema,
  TEvmReceiptsBody,
  TWalletActivities,
  WalletActivitiesSchema,
} from '@models/notifications.model';
import { APIError, handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import { AxiosResponse } from 'axios';
import logger from 'loglevel';

export class NotificationsApi {
  private readonly className: string;
  private readonly resource: string;
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.resource = 'wallets';
    this.className = this.constructor.name;
    this.httpClient = httpClient;
  }

  public async getTransactions(
    address: Address,
    chainId: ChainId,
  ): Promise<TEvmReceiptsBody> {
    logger.debug(`${this.className}: Get transactions`);
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `/${this.resource}/${address}/chains/${chainId}/transactions`,
      );
      return EvmReceiptsBodySchema.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async markTransactionsAsRead(
    address: Address,
    chainId: ChainId,
    blockNumber: string,
  ): Promise<unknown> {
    try {
      logger.debug(`${this.className}: Mark transactions as read`);
      const response = await this.httpClient.put(`/${this.resource}`, {
        blockNumber,
        eoa: address,
        chainId,
      });
      return response.data;
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async getWalletNotifications(): Promise<TWalletActivities> {
    logger.debug(`${this.className}: Get wallet notifications`);
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `/${this.resource}/notifications`,
      );
      return WalletActivitiesSchema.parse(response.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async markWalletNotificationsAsRead(
    address: Address,
    hashes: string[],
  ): Promise<unknown> {
    try {
      logger.debug(`${this.className}: Mark wallet notifications as read`);
      const response = await this.httpClient.put(`/${this.resource}`, {
        notificationIds: hashes,
        eoa: address,
      });
      return response.data;
    } catch (error) {
      throw handleError(error as APIError);
    }
  }
}