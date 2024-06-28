import { TransactionApi } from '@api/transaction.api';
import {
  ITransaction,
  ITransactionSigned,
  ITransactionUnsigned,
} from '@models/transaction.models';
import { handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import logger from 'loglevel';

export class TransactionService {
  private readonly className: string;
  private transactionApi: TransactionApi;

  constructor(httpClient: HttpClient) {
    this.className = this.constructor.name;
    this.transactionApi = new TransactionApi(httpClient);
  }

  public async createTransaction(
    transaction: ITransactionSigned | ITransactionUnsigned,
  ): Promise<ITransaction> {
    logger.info(`${this.className}: Creating Transaction`);
    try {
      return await this.transactionApi.createTransaction(transaction);
    } catch (error) {
      throw handleError(error);
    }
  }

  public async getTransactionById(id: string): Promise<ITransaction> {
    logger.info(`${this.className}: Getting Transaction ${id}`);
    try {
      return await this.transactionApi.getTransactionById(id);
    } catch (error) {
      throw handleError(error);
    }
  }

  public async cancelTransaction(id: string): Promise<void> {
    logger.info(`${this.className}: Cancelling Transaction ${id}`);
    try {
      await this.transactionApi.cancelTransaction(id);
    } catch (error) {
      throw handleError(error);
    }
  }
}
