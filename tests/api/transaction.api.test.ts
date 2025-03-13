import { HttpClient } from '@utils/http-client';
import {
  ITransactionSigned,
  TransactionSchema,
  TransactionTypeKeys,
} from '@models/transaction.models';
import { AxiosResponse } from 'axios';
import { TransactionApi } from '@api/transaction.api';
import { ChainId } from 'index';

jest.mock('@utils/http-client');
jest.mock('loglevel', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
}));

describe('TransactionApi', () => {
  let transaction: TransactionApi;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientMock = new HttpClient('') as jest.Mocked<HttpClient>;
    transaction = new TransactionApi(new HttpClient(''));
    // eslint-disable-next-line
    (transaction as any).httpClient = httpClientMock;
  });

  describe('createSignedTransaction', () => {
    it('should create a signed transaction', async () => {
      const transactionData: ITransactionSigned = {
        transactionType: TransactionTypeKeys.SIGNED,
        signedTx: 'signed-transaction-data',
      };

      const response: Partial<AxiosResponse> = {
        data: {
          data: {
            transactionType: 'signed',
            transactionId: '0c4b319d-1709-4ee3-b6c3-234f9407e8a5',
            signedTx: 'signed-transaction-data',
            from: '0xSender',
            to: '0xReceiver',
            value: '100',
            gasLimit: '21000',
            maxFeePerGas: '1000000000',
            maxPriorityFeePerGas: '2000000000',
            nonce: 1,
            data: '0x',
            chainId: '1',
            status: 'pending',
            fingerprint: 'fingerprint',
            organizationId: 'organizationId',
            walletId: 'walletId',
            userAddress: 'address',
          },
        },
      };

      httpClientMock.post.mockResolvedValue(response as AxiosResponse);

      const result = await transaction.createTransaction(transactionData);
      expect(httpClientMock.post).toHaveBeenCalledWith(
        '/transactions',
        transactionData,
      );
      expect(result).toEqual(TransactionSchema.parse(response.data.data));
    });

    it('should handle errors when creating a signed transaction', async () => {
      const transactionData: ITransactionSigned = {
        transactionType: 'signed',
        signedTx: 'signed-transaction-data',
      };

      httpClientMock.post = jest.fn().mockRejectedValue(new Error('error'));

      await expect(
        transaction.createTransaction(transactionData),
      ).rejects.toThrow('error');
    });
  });

  describe('getTransactionById', () => {
    it('should get transactions', async () => {
      const response = {
        data: {
          currentPage: 0,
          transactions: [
            {
              blockHash: '',
              blockNumber: '',
              contractAddress: '',
              cumulativeGasUsed: '',
              effectiveGasPrice: '',
              from: '',
              gasUsed: '',
              logsBloom: '',
              status: '',
              to: '',
              transactionHash: '',
              transactionIndex: '',
              type: '',
            },
          ],
        },
      };

      httpClientMock.get.mockResolvedValue(response as AxiosResponse);

      const result = await transaction.getTransactions(
        'walletAddress',
        '1' as ChainId,
      );

      expect(httpClientMock.get).toHaveBeenCalledWith(
        '/transactions/walletAddress/chains/1/transactions',
      );
      expect(result).toEqual(response.data.transactions);
    });

    it('should get a transaction by ID', async () => {
      const transactionId = '1234';

      const response: Partial<AxiosResponse> = {
        data: {
          data: {
            transactionType: 'signed',
            transactionId: '0c4b319d-1709-4ee3-b6c3-234f9407e8a5',
            signedTx: 'signed-transaction-data',
            from: '0xSender',
            to: '0xReceiver',
            value: '100',
            gasLimit: '21000',
            maxFeePerGas: '1000000000',
            maxPriorityFeePerGas: '2000000000',
            nonce: 1,
            data: '0x',
            chainId: '1',
            status: 'pending',
            fingerprint: 'fingerprint',
            organizationId: 'organizationId',
            walletId: 'walletId',
            userAddress: 'address',
          },
        },
      };

      httpClientMock.get.mockResolvedValue(response as AxiosResponse);

      const result = await transaction.getTransactionById(transactionId);
      expect(httpClientMock.get).toHaveBeenCalledWith(
        `/transactions/${transactionId}`,
      );
      expect(result).toEqual(TransactionSchema.parse(response.data.data));
    });

    it('should handle errors when getting a transaction by ID', async () => {
      const transactionId = '1234';

      const error = new Error('Failed to get transaction');
      httpClientMock.get.mockRejectedValue(error);

      await expect(
        transaction.getTransactionById(transactionId),
      ).rejects.toThrowError(error);
    });
  });

  describe('cancelTransaction', () => {
    it('should cancel a transaction', async () => {
      const transactionId = '1234';

      httpClientMock.put.mockResolvedValue({} as AxiosResponse);

      await transaction.cancelTransaction(transactionId);
      expect(httpClientMock.put).toHaveBeenCalledWith(
        `/transactions/${transactionId}/cancel`,
      );
    });

    it('should handle errors when cancelling a transaction', async () => {
      const transactionId = '1234';

      const error = new Error('Failed to cancel transaction');
      httpClientMock.put.mockRejectedValue(error);

      await expect(
        transaction.cancelTransaction(transactionId),
      ).rejects.toThrow(error);
    });
  });

  describe('approveSignTransaction', () => {
    const data = {
      id: 'id',
      organizationId: 'organizationId',
      timestamp: 'timestamp',
      stamped: {
        stampHeaderName: 'stampHeaderName',
        stampHeaderValue: 'stampHeaderValue',
      },
    };

    it('should handle errors when approving a transaction', async () => {
      const error = new Error('Failed to cancel transaction');
      httpClientMock.post.mockRejectedValue(error);

      await expect(transaction.approveSignTransaction(data)).rejects.toThrow(
        error,
      );
    });

    it('should approve transaction', async () => {
      const response = {
        data: {
          status: 'approved',
          signedTransaction: '0x1234',
        },
      };

      httpClientMock.post.mockResolvedValue({
        data: response,
      } as AxiosResponse);

      await transaction.approveSignTransaction(data);
      expect(httpClientMock.post).toHaveBeenCalledWith(
        `/transactions/${data.id}/approve`,
        data,
      );
    });
  });

  describe('rejectSignTransaction', () => {
    const data = {
      id: 'id',
      organizationId: 'organizationId',
      timestamp: 'timestamp',
      stamped: {
        stampHeaderName: 'stampHeaderName',
        stampHeaderValue: 'stampHeaderValue',
      },
    };

    it('should handle errors when approving a transaction', async () => {
      const error = new Error('Failed to cancel transaction');
      httpClientMock.post.mockRejectedValue(error);

      await expect(transaction.rejectSignTransaction(data)).rejects.toThrow(
        error,
      );
    });

    it('should reject transaction', async () => {
      const response = {
        data: {
          status: 'rejected',
          signedTransaction: '',
        },
      };

      httpClientMock.post.mockResolvedValue({
        data: response,
      } as AxiosResponse);

      await transaction.rejectSignTransaction(data);
      expect(httpClientMock.post).toHaveBeenCalledWith(
        `/transactions/${data.id}/reject`,
        data,
      );
    });
  });
});
