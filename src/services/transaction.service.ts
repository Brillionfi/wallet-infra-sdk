import { TransactionApi } from '@api/transaction.api';
import {
  ISignTransactionResponse,
  ISignTransactionWithPasskey,
  IStamped,
  ITransaction,
  ITransactionSigned,
  ITransactionUnsigned,
  TransactionTypeActivityKeys,
} from '@models/transaction.models';
import { handleError } from '@utils/errors';
import { HttpClient } from '@utils/http-client';
import {
  WebauthnStamper,
  WalletStamper,
  BaseWalletInterface,
  WalletType,
} from '@utils/stampers';
import { ethers } from 'ethers';
import logger from 'loglevel';
import { Address, ChainId } from '@models/common.models';
import { TEvmReceiptsBody } from '@models/notifications.model';

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

  public async getTransactions(
    address: Address,
    chainId: ChainId,
  ): Promise<TEvmReceiptsBody> {
    logger.info(`${this.className}: Getting notifications`);
    try {
      return await this.transactionApi.getTransactions(address, chainId);
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
    timestamp: string,
    stamped: IStamped,
  ): Promise<ISignTransactionResponse> {
    logger.info(`${this.className}: Approving Transaction ${id}`);
    try {
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
    timestamp: string,
    stamped: IStamped,
  ): Promise<ISignTransactionResponse> {
    logger.info(`${this.className}: Cancelling Transaction ${id}`);
    try {
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

  public async signWithPasskey(
    credentialId: string,
    organizationId: string,
    fingerprint: string,
    fromOrigin: string,
    type: TransactionTypeActivityKeys,
  ): Promise<ISignTransactionWithPasskey> {
    try {
      const id = Buffer.from(credentialId, 'base64');
      const stamper = new WebauthnStamper({
        rpId: fromOrigin,
        allowCredentials: [
          {
            id: id,
            type: 'public-key',
          },
        ],
        userVerification: 'preferred',
      });

      const timestamp = Date.now().toString();

      const request = {
        type,
        timestampMs: timestamp,
        organizationId,
        parameters: {
          fingerprint,
        },
      };
      const stamped = await stamper.stamp(JSON.stringify(request));

      return {
        stamped,
        timestamp,
      };
    } catch (error) {
      throw handleError(error);
    }
  }

  public async signWithMnemonic(
    mnemonic: string,
    organizationId: string,
    fingerprint: string,
    type: TransactionTypeActivityKeys,
  ): Promise<ISignTransactionWithPasskey> {
    try {
      const wallet = ethers.Wallet.fromPhrase(mnemonic);

      const walletInterface: BaseWalletInterface = {
        type: WalletType.Ethereum,
        signMessage: async (message: string) => wallet.signMessage(message),
        getPublicKey: async () => wallet.publicKey,
      };

      const stamper = new WalletStamper(walletInterface);

      const timestamp = Date.now().toString();
      const request = {
        type,
        timestampMs: timestamp,
        organizationId,
        parameters: {
          fingerprint,
        },
      };
      const stamped = await stamper.stamp(JSON.stringify(request));

      return {
        stamped,
        timestamp,
      };
    } catch (error) {
      throw handleError(error);
    }
  }
}
