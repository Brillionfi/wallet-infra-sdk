import { TransactionApi } from '@api/transaction.api';
import {
  ITransactionSigned,
  TransactionKeys,
  TransactionTypeKeys,
} from '@models/transaction.models';
import { HttpClient } from '@utils/http-client';

export class TransactionService {
  private transactionApi: TransactionApi;

  constructor(httpClient: HttpClient) {
    this.transactionApi = new TransactionApi(httpClient);
  }

  public async createTransaction(transaction: ITransactionSigned) {
    if (
      transaction[TransactionKeys.TRANSACTION_TYPE] ===
      TransactionTypeKeys.SIGNED
    ) {
      return this.transactionApi.createSignedTransaction(transaction);
    }
  }

  public async getTransactionById(id: string) {
    return this.transactionApi.getTransactionById(id);
  }
}
