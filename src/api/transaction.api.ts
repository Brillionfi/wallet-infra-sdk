import { HttpClient } from '@utils/http-client';
import logger from 'loglevel';
import { APIError, handleError } from '@utils/errors';
import {
  ISignTransactionResponse,
  ISignTransactionSchema,
  ITransaction,
  ITransactionSigned,
  ITransactionUnsigned,
  SignTransactionResponseSchema,
  TransactionSchema,
} from '@models/transaction.models';
import { AxiosResponse } from 'axios';

export class TransactionApi {
  private resource: string;
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.resource = 'transactions';
    this.httpClient = httpClient;
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

  public async approveSignTransaction(
    body: ISignTransactionSchema,
  ): Promise<ISignTransactionResponse> {
    logger.debug('TransactionApi: Cancel transaction');
    try {
      const response: AxiosResponse = await this.httpClient.post(
        `/${this.resource}/${body.id}/approve`,
        body,
      );

      return SignTransactionResponseSchema.parse(response.data.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }

  public async rejectSignTransaction(
    body: ISignTransactionSchema,
  ): Promise<ISignTransactionResponse> {
    logger.debug('TransactionApi: Cancel transaction');
    try {
      const response: AxiosResponse = await this.httpClient.post(
        `/${this.resource}/${body.id}/reject`,
        body,
      );

      return SignTransactionResponseSchema.parse(response.data.data);
    } catch (error) {
      throw handleError(error as APIError);
    }
  }
}
