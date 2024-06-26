import { z } from 'zod';
import { ChainIdSchema } from './common.models';

export enum TransactionTypeKeys {
  SIGNED = 'signed',
  UNSIGNED = 'unsigned',
}

export enum TransactionStatusKeys {
  QUEUED = 'queued',
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELED = 'canceled',
}

export enum TransactionKeys {
  TRANSACTION_TYPE = 'transactionType',
  TRANSACTION_ID = 'transactionId',
  TRANSACTION_HASH = 'transactionHash',
  SIGNED_TX = 'signedTx',
  FROM = 'from',
  TO = 'to',
  VALUE = 'value',
  GAS_LIMIT = 'gasLimit',
  MAX_FEE_PER_GAS = 'maxFeePerGas',
  MAX_PRIORITY_FEE_PER_GAS = 'maxPriorityFeePerGas',
  NONCE = 'nonce',
  DATA = 'data',
  CHAIN_ID = 'chainId',
  MESSAGE_ID = 'messageId',
  RECEIPT_HANDLE = 'receiptHandle',
  STATUS = 'status',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  UPDATED_BY = 'updatedBy',
  AUTHENTICATED_BY = 'authenticatedBy',
  AUTHENTICATED_METHOD = 'authenticationMethod',
}

export const TransactionTypeSchema = z.union([
  z.literal('signed'),
  z.literal('unsigned'),
]);

export const TransactionStatusSchema = z.enum([
  TransactionStatusKeys.QUEUED,
  TransactionStatusKeys.PENDING,
  TransactionStatusKeys.SUCCESS,
  TransactionStatusKeys.FAILED,
  TransactionStatusKeys.CANCELED,
]);

export const TransactionSchema = z.object({
  [TransactionKeys.TRANSACTION_TYPE]: TransactionTypeSchema.optional(),
  [TransactionKeys.TRANSACTION_ID]: z.string().uuid(),
  [TransactionKeys.TRANSACTION_HASH]: z.string().optional(),
  [TransactionKeys.SIGNED_TX]: z.string().optional(),
  [TransactionKeys.FROM]: z.string(),
  [TransactionKeys.TO]: z.string(),
  [TransactionKeys.VALUE]: z.number(),
  [TransactionKeys.GAS_LIMIT]: z.number(),
  [TransactionKeys.MAX_FEE_PER_GAS]: z.number(),
  [TransactionKeys.MAX_PRIORITY_FEE_PER_GAS]: z.number(),
  [TransactionKeys.NONCE]: z.number(),
  [TransactionKeys.DATA]: z.string(),
  [TransactionKeys.CHAIN_ID]: ChainIdSchema,
  [TransactionKeys.MESSAGE_ID]: z.string().optional(),
  [TransactionKeys.RECEIPT_HANDLE]: z.string().optional(),
  [TransactionKeys.STATUS]: TransactionStatusSchema.optional(),
  [TransactionKeys.AUTHENTICATED_BY]: z.string().optional(),
  [TransactionKeys.AUTHENTICATED_METHOD]: z.string().optional(),
});

export const TransactionSignedSchema = z.object({
  [TransactionKeys.TRANSACTION_TYPE]: TransactionTypeSchema,
  [TransactionKeys.SIGNED_TX]: z.string(),
});

export const TransactionUnsignedSchema = z.object({
  [TransactionKeys.TRANSACTION_TYPE]: TransactionTypeSchema,
  [TransactionKeys.FROM]: z.string(),
  [TransactionKeys.TO]: z.string(),
  [TransactionKeys.VALUE]: z.string(),
  [TransactionKeys.DATA]: z.string(),
  [TransactionKeys.CHAIN_ID]: z.string(),
});

export type ITransaction = z.infer<typeof TransactionSchema>;
export type ITransactionSigned = z.infer<typeof TransactionSignedSchema>;
export type ITransactionUnsigned = z.infer<typeof TransactionUnsignedSchema>;
