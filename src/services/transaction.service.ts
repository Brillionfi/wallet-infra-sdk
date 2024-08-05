import { TransactionApi } from '@api/transaction.api';
import {
  ISignTransactionResponse,
  ITransaction,
  ITransactionSigned,
  ITransactionUnsigned,
} from '@models/transaction.models';
import { handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import { WebauthnStamper } from '@utils/stampers';
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

  public async approveSignTransaction(
    id: string,
    organizationId: string,
    fingerprint: string,
    fromOrigin: string,
  ): Promise<ISignTransactionResponse> {
    logger.info(`${this.className}: Cancelling Transaction ${id}`);
    try {
      const stamper = new WebauthnStamper({
        rpId: fromOrigin,
      });

      const timestamp = Date.now().toString();

      const request = {
        type: 'ACTIVITY_TYPE_APPROVE_ACTIVITY',
        timestampMs: timestamp,
        organizationId: organizationId,
        parameters: {
          fingerprint,
        },
      };
      const stamped = await stamper.stamp(JSON.stringify(request));

      return await this.transactionApi.approveSignTransaction({
        id,
        organizationId,
        timestamp,
        stamped,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  public async rejectSignTransaction(
    id: string,
    organizationId: string,
    fingerprint: string,
    fromOrigin: string,
  ): Promise<ISignTransactionResponse> {
    logger.info(`${this.className}: Cancelling Transaction ${id}`);
    try {
      const stamper = new WebauthnStamper({
        rpId: fromOrigin,
      });

      const timestamp = Date.now().toString();

      const request = {
        type: 'ACTIVITY_TYPE_REJECT_ACTIVITY',
        timestampMs: timestamp,
        organizationId: organizationId,
        parameters: {
          fingerprint,
        },
      };
      const stamped = await stamper.stamp(JSON.stringify(request));

      return await this.transactionApi.rejectSignTransaction({
        id,
        organizationId,
        timestamp,
        stamped,
      });
    } catch (error) {
      throw handleError(error);
    }
  }
}
