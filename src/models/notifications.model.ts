import { z } from 'zod';

const ActivityStatus = z.enum(['READ', 'NOT_READ']);
export const EActivityStatus = ActivityStatus.enum;

const ActivityLevel = z.enum(['INFO', 'WARNING', 'ERROR']);
export const EActivityLevel = ActivityLevel.enum;

export const WalletActivity = z.object({
  id: z.string(),
  fingerprint: z.string(),
  organizationId: z.string(),
  type: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  canApprove: z.boolean(),
  canReject: z.boolean(),
  votes: z
    .array(
      z.object({
        selection: z.string(),
        userId: z.string(),
        user: z.object({
          userName: z.string().optional(),
          userEmail: z.string().optional(),
        }),
      }),
    )
    .optional(),
  intent: z.object({}).passthrough(),
  result: z.object({}).passthrough().optional(),
  notificationLevel: ActivityLevel,
  notificationStatus: ActivityStatus,
});
export const WalletActivitiesSchema = z.array(WalletActivity);
export type TWalletActivity = z.infer<typeof WalletActivity>;
export type TWalletActivities = z.infer<typeof WalletActivitiesSchema>;

export const EvmReceiptLogSchema = z.object({
  address: z.string(),
  blockHash: z.string(),
  blockNumber: z.string(),
  data: z.string(),
  logIndex: z.string(),
  removed: z.boolean(),
  topics: z.array(z.string()).nullable().optional(),
  transactionHash: z.string(),
  transactionIndex: z.string(),
});
export const EvmReceiptSchema = z.object({
  blockHash: z.string(),
  blockNumber: z.string(),
  contractAddress: z.string(),
  cumulativeGasUsed: z.string(),
  effectiveGasPrice: z.string(),
  from: z.string(),
  gasUsed: z.string(),
  logs: z.array(EvmReceiptLogSchema).nullable().optional(),
  logsBloom: z.string(),
  status: z.string(),
  to: z.string(),
  transactionHash: z.string(),
  transactionIndex: z.string(),
  type: z.string(),
  chainId: z.string().optional(),
});
export const EvmReceiptsBodySchema = z.array(EvmReceiptSchema);
export type TEvmReceiptsBody = z.infer<typeof EvmReceiptsBodySchema>;
export type TEvmReceipt = z.infer<typeof EvmReceiptSchema>;

export type TEntry = {
  pk: string;
  sk: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
};

export type INotification = TWalletActivity | TEvmReceipt;

export type INotifications = INotification[];
