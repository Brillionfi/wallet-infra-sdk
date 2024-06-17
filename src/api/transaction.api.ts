import { HttpClient } from '@utils/http-client';
import logger from '@utils/logger';
import { APIError, handleError } from '@utils/errors';
import {
  ITransaction,
  ITransactionSigned,
  ITransactionUnsigned,
  TransactionSchema,
} from '@models/transaction.models';
import { AxiosResponse } from 'axios';

export class TransactionApi {
  private resource: string;
  private httpClient: HttpClient;

  constructor() {
    this.resource = 'transactions';
    this.httpClient = new HttpClient();
  }

  public async createTransaction(
    data: ITransactionSigned | ITransactionUnsigned,
  ): Promise<ITransaction> {
    logger.debug('TransactionApi: Create Transaction');
    try {
      const response: AxiosResponse = await this.httpClient.post(
        `/${this.resource}`,
        data,
      );

      return TransactionSchema.parse(response.data.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async getTransactionById(id: string): Promise<ITransaction> {
    logger.debug('TransactionApi: Get transaction by ID');
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `/${this.resource}/${id}`,
      );

      return TransactionSchema.parse(response.data.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async cancelTransaction(id: string): Promise<void> {
    logger.debug('TransactionApi: Cancel transaction');
    try {
      await this.httpClient.put(`/${this.resource}/${id}/canacel`);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }
}
