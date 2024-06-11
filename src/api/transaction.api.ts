import { HttpClient } from '@utils/http-client';
import logger from '@utils/logger';
import { handleError } from '@utils/errors';
import { ITransactionSigned } from '@models/transaction.models';
import { AxiosResponse } from 'axios';

export class TransactionApi {
  private resource: string;
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.resource = 'transactions';
    this.httpClient = httpClient;
  }

  public async createSignedTransaction(data: ITransactionSigned) {
    logger.info('TransactionApi: Create signed transaction');
    try {
      logger.debug(`TransactionApi: ${JSON.stringify(data)}`);
      const response = await this.httpClient.post(`/${this.resource}`, data);
      logger.debug(`Response: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      logger.error('TransactionApi: Create signed transaction');
      handleError(error as Error);
    }
  }

  public async getTransactionById(id: string) {
    logger.info('TransactionApi: Get transaction by ID');
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `/${this.resource}/${id}`,
      );
      return response.data.data;
    } catch (error) {
      logger.error('TransactionApi: Get transaction by ID');
      handleError(error as Error);
    }
  }
}
