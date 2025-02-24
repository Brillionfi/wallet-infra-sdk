import { TransactionService } from '@services/transaction.service';
import { TransactionApi } from '@api/transaction.api';
import { SUPPORTED_CHAINS } from '@models/common.models';
import {
  ITransaction,
  TransactionStatusKeys,
  TransactionTypeActivityKeys,
  TransactionTypeKeys,
} from '@models/transaction.models';
import { HttpClient } from '@utils/http-client';
import { WebauthnStamper } from '@utils/encoding';

jest.mock('@api/transaction.api');
jest.mock('@utils/http-client');
jest.mock('loglevel', () => ({
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
}));

describe('TransactionService', () => {
  let transactionApi: jest.Mocked<TransactionApi>;
  let transactionService: TransactionService;

  beforeEach(() => {
    transactionApi = new TransactionApi(
      new HttpClient(''),
    ) as jest.Mocked<TransactionApi>;

    (TransactionApi as jest.Mock<TransactionApi>).mockImplementation(
      () => transactionApi,
    );

    transactionService = new TransactionService(new HttpClient(''));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    it('should create a signed transaction successfully', async () => {
      const transaction = {
        transactionType: TransactionTypeKeys.SIGNED,
        signedTx: 'signed-transaction-data',
      };

      const createdTransaction: ITransaction = {
        transactionType: TransactionTypeKeys.SIGNED,
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
        chainId: SUPPORTED_CHAINS.ETHEREUM,
        status: TransactionStatusKeys.PENDING,
        organizationId: 'organizationId',
        fingerprint: 'fingerprint',
        walletId: 'id',
        userAddress: 'address',
      };

      transactionApi.createTransaction = jest
        .fn()
        .mockResolvedValue(createdTransaction);

      const result = await transactionService.createTransaction(transaction);

      expect(result).toBe(createdTransaction);
      expect(transactionApi.createTransaction).toHaveBeenCalledWith(
        transaction,
      );
    });

    it('should create an unsigned transaction successfully', async () => {
      const transaction = {
        transactionType: TransactionTypeKeys.UNSIGNED,
        from: '0x9E4549638dC32F11c7726e26205705bcDc87E056',
        to: '0xF9e3C81871dF06754AbFC054593762DB0bE48c89',
        value: '100',
        data: '0x',
        chainId: '1',
      };

      const createdTransaction: ITransaction = {
        transactionType: TransactionTypeKeys.UNSIGNED,
        transactionId: '0c4b319d-1709-4ee3-b6c3-234f9407e8a5',
        signedTx: 'signed-transaction-data',
        from: '0x9E4549638dC32F11c7726e26205705bcDc87E056',
        to: '0xF9e3C81871dF06754AbFC054593762DB0bE48c89',
        value: '100',
        gasLimit: '21000',
        maxFeePerGas: '1000000000',
        maxPriorityFeePerGas: '2000000000',
        nonce: 1,
        data: '0x',
        chainId: SUPPORTED_CHAINS.ETHEREUM,
        status: TransactionStatusKeys.PENDING,
        organizationId: 'organizationId',
        fingerprint: 'fingerprint',
        walletId: 'id',
        userAddress: 'address',
      };

      transactionApi.createTransaction = jest
        .fn()
        .mockResolvedValue(createdTransaction);

      const result = await transactionService.createTransaction(transaction);

      expect(result).toBe(createdTransaction);
      expect(transactionApi.createTransaction).toHaveBeenCalledWith(
        transaction,
      );
    });

    it('should handle errors thrown by the API', async () => {
      const signedTx = {
        transactionType: TransactionTypeKeys.SIGNED,
        signedTx: 'signed-transaction-data',
      };

      const error = new Error('API Error');
      transactionApi.createTransaction.mockRejectedValue(error);

      await expect(
        transactionService.createTransaction(signedTx),
      ).rejects.toThrow(error);
    });
  });

  describe('getTransactionById', () => {
    it('should return a transaction by ID successfully', async () => {
      const transaction: ITransaction = {
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
        chainId: SUPPORTED_CHAINS.ETHEREUM,
        status: TransactionStatusKeys.PENDING,
        organizationId: 'organizationId',
        fingerprint: 'fingerprint',
        userAddress: 'address',
        walletId: 'id',
      };

      transactionApi.getTransactionById.mockResolvedValue(transaction);

      const result = await transactionService.getTransactionById(
        transaction.transactionId,
      );

      expect(result).toBe(transaction);
      expect(transactionApi.getTransactionById).toHaveBeenCalledWith(
        transaction.transactionId,
      );
    });

    it('should handle errors thrown by the API', async () => {
      const transactionId = '12345';
      const error = new Error('API Error');

      transactionApi.getTransactionById.mockRejectedValue(error);

      await expect(
        transactionService.getTransactionById(transactionId),
      ).rejects.toThrow(error);
    });
  });

  describe('cancelTransaction', () => {
    it('should cancel a transaction successfully', async () => {
      const transactionId = '0c4b319d-1709-4ee3-b6c3-234f9407e8a5';

      transactionApi.cancelTransaction.mockResolvedValue();

      await transactionService.cancelTransaction(transactionId);

      expect(transactionApi.cancelTransaction).toHaveBeenCalledWith(
        transactionId,
      );
    });

    it('should handle errors thrown by the API', async () => {
      const transactionId = '12345';
      const error = new Error('API Error');

      transactionApi.cancelTransaction.mockRejectedValue(error);

      await expect(
        transactionService.cancelTransaction(transactionId),
      ).rejects.toThrow(error);
    });
  });

  describe('signWithPasskey', () => {
    const credentialId = 'credentialId';
    const organizationId = 'organizationId';
    const fingerprint = 'fingerprint';
    const fromOrigin = 'fromOrigin';
    const stamped = {
      stampHeaderName: 'name',
      stampHeaderValue: 'value',
    };

    it('should handle error if stamp fails', async () => {
      const error = new Error('Stamp Error');
      jest.spyOn(WebauthnStamper.prototype, 'stamp').mockRejectedValue(error);

      await expect(
        transactionService.signWithPasskey(
          credentialId,
          organizationId,
          fingerprint,
          fromOrigin,
          TransactionTypeActivityKeys.ACTIVITY_TYPE_APPROVE_ACTIVITY,
        ),
      ).rejects.toThrow(error);
    });

    it('should sign with passkey successfully', async () => {
      jest.spyOn(WebauthnStamper.prototype, 'stamp').mockResolvedValue(stamped);

      const response = await transactionService.signWithPasskey(
        credentialId,
        organizationId,
        fingerprint,
        fromOrigin,
        TransactionTypeActivityKeys.ACTIVITY_TYPE_APPROVE_ACTIVITY,
      );

      expect(response).toStrictEqual({
        timestamp: expect.anything(),
        stamped,
      });
    });
  });

  describe('approveSignTransaction', () => {
    const id = 'id';
    const organizationId = 'organizationId';
    const timestamp = new Date().toISOString();
    const stamped = {
      stampHeaderName: 'name',
      stampHeaderValue: 'value',
    };

    it('should handle errors thrown by the API', async () => {
      const error = new Error('API Error');

      transactionApi.approveSignTransaction.mockRejectedValue(error);

      await expect(
        transactionService.approveSignTransaction(
          id,
          organizationId,
          timestamp,
          stamped,
        ),
      ).rejects.toThrow(error);
    });

    it('should cancel a transaction successfully', async () => {
      const response = {
        status: 'approved',
        signedTransaction: '0x1234',
      };

      transactionApi.approveSignTransaction.mockResolvedValue(response);

      await transactionService.approveSignTransaction(
        id,
        organizationId,
        timestamp,
        stamped,
      );

      expect(transactionApi.approveSignTransaction).toHaveBeenCalledWith({
        id,
        organizationId,
        timestamp: expect.anything(),
        stamped: {
          stampHeaderName: 'name',
          stampHeaderValue: 'value',
        },
      });
    });
  });

  describe('rejectSignTransaction', () => {
    const id = 'id';
    const organizationId = 'organizationId';
    const timestamp = new Date().toISOString();
    const stamped = {
      stampHeaderName: 'name',
      stampHeaderValue: 'value',
    };

    it('should handle errors thrown by the API', async () => {
      jest.spyOn(WebauthnStamper.prototype, 'stamp').mockResolvedValue({
        stampHeaderName: 'name',
        stampHeaderValue: 'value',
      });

      const error = new Error('API Error');

      transactionApi.rejectSignTransaction.mockRejectedValue(error);

      await expect(
        transactionService.rejectSignTransaction(
          id,
          organizationId,
          timestamp,
          stamped,
        ),
      ).rejects.toThrow(error);
    });

    it('should cancel a transaction successfully', async () => {
      const response = {
        status: 'approved',
        signedTransaction: '',
      };

      transactionApi.rejectSignTransaction.mockResolvedValue(response);

      await transactionService.rejectSignTransaction(
        id,
        organizationId,
        timestamp,
        stamped,
      );

      expect(transactionApi.rejectSignTransaction).toHaveBeenCalledWith({
        id,
        organizationId,
        timestamp: expect.anything(),
        stamped: {
          stampHeaderName: 'name',
          stampHeaderValue: 'value',
        },
      });
    });
  });
});
