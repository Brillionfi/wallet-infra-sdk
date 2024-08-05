import { z } from 'zod';
import {
  type Address,
  type ChainId,
  ChainIdSchema,
  EthereumAddressSchema,
} from './common.models';
import { non0xString } from './common.models';

export enum WalletKeys {
  TYPE = 'type',
  ADDRESS = 'address',
  NAME = 'name',
  FORMAT = 'format',
  OWNER = 'owner',
  AUTHENTICATION = 'authentication',
}

export enum WalletTypes {
  EOA = 'EOA',
}

export enum WalletFormats {
  ETHEREUM = 'ethereum',
  SOLANA = 'solana',
  COSMOS = 'cosmos',
  TRON = 'tron',
}

export const WalletTypesValues = [WalletTypes.EOA] as const;
export const WalletTypesSchema = z.enum(WalletTypesValues);

export const WalletFormatsValues = [
  WalletFormats.ETHEREUM,
  WalletFormats.SOLANA,
  WalletFormats.COSMOS,
  WalletFormats.TRON,
] as const;
export const WalletFormatsSchema = z.enum(WalletFormatsValues);

export const PasskeyAuthenticationSchema = z.object({
  challenge: z.string(),
  attestation: z.object({
    credentialId: z.string(),
    clientDataJson: z.string(),
    attestationObject: z.string(),
    transports: z.array(z.string()),
  }),
});

export const WalletSchema = z.object({
  [WalletKeys.ADDRESS]: z.string().optional(),
  [WalletKeys.TYPE]: WalletTypesSchema,
  [WalletKeys.NAME]: z.string(),
  [WalletKeys.FORMAT]: WalletFormatsSchema,
  [WalletKeys.OWNER]: z.string().optional(),
  [WalletKeys.AUTHENTICATION]: PasskeyAuthenticationSchema.optional(),
});

export const WalletSchemaAPI = z.object({
  walletType: z.object({
    [WalletTypes.EOA.toLocaleLowerCase()]: z
      .object({
        walletName: z.string(),
        walletFormat: WalletFormatsSchema,
        authentication: PasskeyAuthenticationSchema,
      })
      .optional(),
  }),
});

export const WalletResponseSchema = z.record(
  z.object({
    walletAddress: z.string(),
    walletFormat: WalletFormatsSchema,
    walletType: WalletTypesSchema,
    walletName: z.string(),
    authentication: PasskeyAuthenticationSchema.optional(),
  }),
);

export const WalletSignTransactionSchema = z.object({
  walletFormat: WalletFormatsSchema,
  walletType: WalletTypesSchema,
  unsignedTransaction: non0xString,
});

export const WalletSignTransactionResponseSchema = z.object({
  data: z.object({
    organizationId: z.string(),
    needsApproval: z.boolean(),
    fingerprint: z.string(),
    activityId: z.string(),
    signedTransaction: z.string().optional(),
  }),
});

export const WalletSignTransactionServiceResponseSchema = z.object({
  organizationId: z.string(),
  needsApproval: z.boolean(),
  fingerprint: z.string(),
  activityId: z.string(),
  signedTransaction: z.string().optional(),
});

export const WalletTransactionSchema = z.object({
  transactionId: z.string(),
  transactionHash: z.string(),
  address: EthereumAddressSchema,
  chainId: ChainIdSchema,
  walletAddress: EthereumAddressSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  updatedBy: z.string(),
});

export const WalletGasConfigurationSchema = z.object({
  gasLimit: z.string(),
  maxFeePerGas: z.string(),
  maxPriorityFeePerGas: z.string(),
});

export const WalletGasConfigurationResponseSchema = z.object({
  status: z.string(),
});

export const WalletNonceResponseSchema = z.object({
  nonce: z.number(),
});

export const WalletGasEstimationSchema = z.object({
  gasLimit: z.string(),
  gasFee: z.string(),
  maxGasFee: z.string(),
  gasPrice: z.string(),
  maxFeePerGas: z.string(),
  maxPriorityFeePerGas: z.string(),
  totalCostString: z.string(),
  totalMaxCostString: z.string(),
});

export interface IGetGasFeesParameters {
  chainId: ChainId;
  from: Address;
  to: Address;
  value: string;
  data: string;
}

export const WalletRecoverySchema = z.object({
  eoa: z.object({
    organizationId: z.string(),
    userId: z.string(),
    needsApproval: z.boolean(),
    fingerprint: z.string(),
    activityId: z.string(),
  }),
});

export const WalletPortfolioSchema = z.object({
  address: z.string(),
  chainId: ChainIdSchema,
  portfolio: z.array(
    z.object({
      tokenId: z.string(),
      balance: z.string(),
      decimals: z.number().optional(),
      address: z.string().optional(),
      tokenPriceUsd: z.string().optional(),
    }),
  ),
});

export const WalletNotificationsSchema = z.array(
  z.object({
    id: z.string(),
    fingerprint: z.string(),
    organizationId: z.string(),
    type: z.string(),
    status: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    canApprove: z.boolean(),
    canReject: z.boolean(),
    votes: z.array(
      z.object({
        selection: z.string(),
        userId: z.string(),
        user: z.object({
          userName: z.string().optional(),
          userEmail: z.string().optional(),
        }),
      }),
    ),
    intent: z.object({}).passthrough(),
    result: z.object({}).passthrough().optional(),
    notificationLevel: z.string(),
    notificationStatus: z.string(),
  }),
);

export const TurnkeyWalletActivitySchema = z.object({
  id: z.string(),
  fingerprint: z.string(),
  organizationId: z.string(),
  type: z.string(),
  status: z.string(),
  createdAt: z
    .object({
      seconds: z.string(),
    })
    .transform((arg) => arg.seconds + '000'),
  updatedAt: z
    .object({
      seconds: z.string(),
    })
    .transform((arg) => arg.seconds + '000'),
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
  result: z
    .object({
      signTransactionResult: z
        .object({
          signedTransaction: z.string().optional(),
        })
        .optional(),
    })
    .passthrough()
    .optional(),
});

export type IWallet = z.infer<typeof WalletSchema>;
export type IWalletAPI = z.infer<typeof WalletSchemaAPI>;
export type IWalletResponse = z.infer<typeof WalletResponseSchema>;
export type IWalletSignTransaction = z.infer<
  typeof WalletSignTransactionSchema
>;
export type IWalletSignTransactionAPI = z.infer<
  typeof WalletSignTransactionResponseSchema
>;
export type IWalletSignTransactionService = z.infer<
  typeof WalletSignTransactionServiceResponseSchema
>;
export type IWalletGasConfiguration = z.infer<
  typeof WalletGasConfigurationSchema
>;
export type IWalletGasConfigurationAPI = z.infer<
  typeof WalletGasConfigurationResponseSchema
>;
export type IWalletNonceAPI = z.infer<typeof WalletNonceResponseSchema>;
export type IWalletTransaction = z.infer<typeof WalletTransactionSchema>;
export type IWalletGasEstimation = z.infer<typeof WalletGasEstimationSchema>;
export type IWalletRecovery = z.infer<typeof WalletRecoverySchema>;
export type IWalletPortfolio = z.infer<typeof WalletPortfolioSchema>;
export type IWalletNotifications = z.infer<typeof WalletNotificationsSchema>;
export type ITurnkeyWalletActivity = z.infer<
  typeof TurnkeyWalletActivitySchema
>;
