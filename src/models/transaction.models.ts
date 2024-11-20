import { z } from 'zod';
import { ChainIdSchema } from './common.models';
import { stampedActivitySchema } from './wallet.models';

export enum TransactionTypeKeys {
  SIGNED = 'signed',
  UNSIGNED = 'unsigned',
}

export enum TransactionStatusKeys {
  QUEUED = 'queued',
  PENDING = 'pending',
  SUCCESS = 'success',
  PUBLISHED = 'published',
  FAILED = 'failed',
  CANCELED = 'canceled',
  REJECTED = 'rejected',
  APPROVED = 'approved',
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
  GAS_PRICE = 'gasPrice',
  MAX_FEE_PER_GAS = 'maxFeePerGas',
  MAX_PRIORITY_FEE_PER_GAS = 'maxPriorityFeePerGas',
  NONCE = 'nonce',
  DATA = 'data',
  CHAIN_ID = 'chainId',
  MESSAGE_ID = 'messageId',
  RECEIPT_HANDLE = 'receiptHandle',
  STATUS = 'status',
  REASON = 'reason',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  UPDATED_BY = 'updatedBy',
  AUTHENTICATED_BY = 'authenticatedBy',
  AUTHENTICATED_METHOD = 'authenticationMethod',
  FINGERPRINT = 'fingerprint',
  ORGANIZATION_ID = 'organizationId',
  USER_ADDRESS = 'userAddress',
  WALLET_ID = 'walletId',
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
  TransactionStatusKeys.PUBLISHED,
  TransactionStatusKeys.CANCELED,
  TransactionStatusKeys.REJECTED,
  TransactionStatusKeys.APPROVED,
]);

export const TransactionSchema = z.object({
  [TransactionKeys.TRANSACTION_TYPE]: TransactionTypeSchema.optional(),
  [TransactionKeys.TRANSACTION_ID]: z.string().uuid(),
  [TransactionKeys.TRANSACTION_HASH]: z.string().optional(),
  [TransactionKeys.SIGNED_TX]: z.string().optional(),
  [TransactionKeys.FROM]: z.string(),
  [TransactionKeys.TO]: z.string(),
  [TransactionKeys.VALUE]: z.string(),
  [TransactionKeys.GAS_LIMIT]: z.string(),
  [TransactionKeys.GAS_PRICE]: z.string().optional(),
  [TransactionKeys.MAX_FEE_PER_GAS]: z.string().optional(),
  [TransactionKeys.MAX_PRIORITY_FEE_PER_GAS]: z.string().optional(),
  [TransactionKeys.NONCE]: z.number(),
  [TransactionKeys.DATA]: z.string(),
  [TransactionKeys.CHAIN_ID]: ChainIdSchema,
  [TransactionKeys.MESSAGE_ID]: z.string().optional(),
  [TransactionKeys.RECEIPT_HANDLE]: z.string().optional(),
  [TransactionKeys.STATUS]: TransactionStatusSchema.optional(),
  [TransactionKeys.REASON]: z.string().optional(),
  [TransactionKeys.AUTHENTICATED_BY]: z.string().optional(),
  [TransactionKeys.AUTHENTICATED_METHOD]: z.string().optional(),
  [TransactionKeys.FINGERPRINT]: z.string(),
  [TransactionKeys.ORGANIZATION_ID]: z.string(),
  [TransactionKeys.USER_ADDRESS]: z.string(),
  [TransactionKeys.WALLET_ID]: z.string(),
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

export const SignTransactionSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  timestamp: z.string(),
  stamped: stampedActivitySchema,
});

export const SignTransactionResponseSchema = z.object({
  status: z.string(),
  signedTransaction: z.string().optional(),
});

export type ITransaction = z.infer<typeof TransactionSchema>;
export type ITransactionSigned = z.infer<typeof TransactionSignedSchema>;
export type ITransactionUnsigned = z.infer<typeof TransactionUnsignedSchema>;
export type ISignTransactionSchema = z.infer<typeof SignTransactionSchema>;
export type ISignTransactionResponse = z.infer<
  typeof SignTransactionResponseSchema
>;
