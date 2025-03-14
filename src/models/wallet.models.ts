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
  SIGNER = 'signer',
}

export enum WalletTypes {
  EOA = 'EOA',
  LIGHT_ACCOUNT_ABSTRACTION = 'LIGHT_ACCOUNT_ABSTRACTION',
  MULTI_SIGNER_ACCOUNT_ABSTRACTION = 'MULTI_SIGNER_ACCOUNT_ABSTRACTION',
  MODULAR_ACCOUNT_ABSTRACTION = 'MODULAR_ACCOUNT_ABSTRACTION',
}

export enum WalletFormats {
  ETHEREUM = 'ethereum',
  SOLANA = 'solana',
  COSMOS = 'cosmos',
  TRON = 'tron',
}

export const WalletTypesValues = [
  WalletTypes.EOA,
  WalletTypes.LIGHT_ACCOUNT_ABSTRACTION,
  WalletTypes.MULTI_SIGNER_ACCOUNT_ABSTRACTION,
  WalletTypes.MODULAR_ACCOUNT_ABSTRACTION,
] as const;
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

export const ApiKeyAuthenticationSchema = z.object({
  publicKey: z.string(),
});

export const WalletSchema = z.object({
  [WalletKeys.ADDRESS]: z.string().optional(),
  [WalletKeys.TYPE]: WalletTypesSchema.optional(),
  [WalletKeys.NAME]: z.string(),
  [WalletKeys.FORMAT]: WalletFormatsSchema,
  [WalletKeys.OWNER]: z.string().optional(),
  [WalletKeys.SIGNER]: z.string().optional(),
  [WalletKeys.AUTHENTICATION]: z
    .union([
      PasskeyAuthenticationSchema.optional(),
      ApiKeyAuthenticationSchema.optional(),
    ])
    .optional(),
});

export const WalletAuthenticator = z.object({
  name: z.string(),
  authenticator: z.union([
    PasskeyAuthenticationSchema.optional(),
    ApiKeyAuthenticationSchema.optional(),
  ]),
});

export const DeleteWalletAuthenticator = z.object({
  authenticators: z.array(z.string()),
});

export const WalletAuthenticatorResponse = z.object({
  authenticators: z.array(
    z.object({
      authenticatorId: z.string(),
      authenticatorName: z.string(),
      credentialId: z.string(),
      model: z.string(),
    }),
  ),
  apiKeys: z.array(
    z.object({
      credential: z.object({
        publicKey: z.string(),
        type: z.enum([
          'CREDENTIAL_TYPE_WEBAUTHN_AUTHENTICATOR',
          'CREDENTIAL_TYPE_API_KEY_P256',
          'CREDENTIAL_TYPE_RECOVER_USER_KEY_P256',
          'CREDENTIAL_TYPE_API_KEY_SECP256K1',
        ]),
      }),
      apiKeyId: z.string(),
      apiKeyName: z.string(),
    }),
  ),
});

export const ActivityResponseSchema = z.object({
  status: z.string(),
  organizationId: z.string(),
  needsApproval: z.boolean(),
  fingerprint: z.string().optional(),
  activityId: z.string().optional(),
});

export const CreateWalletAuthenticatorResponse = ActivityResponseSchema;

export const DeleteWalletAuthenticatorResponse = ActivityResponseSchema;

export const SetRecoveryByEmailStatusResponse = ActivityResponseSchema;

export const WalletSchemaAPI = z.object({
  walletName: z.string(),
  walletFormat: WalletFormatsSchema,
});

export const stampedActivitySchema = z.object({
  stampHeaderName: z.string(),
  stampHeaderValue: z.string(),
});

export const WalletResponseSchema = z.object({
  type: WalletTypesSchema,
  name: z.string(),
  address: z.string(),
  signer: z.object({
    address: z.string(),
    format: WalletFormatsSchema,
  }),
});

const typeData = z.object({
  name: z.string(),
  type: z.string(),
});

const TypesSchema = z.record(z.string(), z.array(typeData));

export const WalletSignMessageSchema = z.object({
  message: z.string().optional(),
  typedData: z
    .object({
      types: TypesSchema,
      primaryType: z.string(),
      domain: z.object({}).passthrough(),
      message: z.object({}).passthrough(),
    })
    .optional(),
});

export const WalletSignTransactionSchema = z.object({
  walletFormat: WalletFormatsSchema,
  walletType: WalletTypesSchema,
  unsignedTransaction: non0xString,
});

export const WalletSignMessageResponseSchema = ActivityResponseSchema.merge(
  z.object({
    rawSignature: z
      .object({
        /** Components of an ECSDA signature. */
        r: z.string(),
        s: z.string(),
        v: z.string(),
      })
      .optional(),
    finalSignature: z.string().optional(),
  }),
);

export const WalletSignTransactionResponseSchema = ActivityResponseSchema.merge(
  z.object({
    signedTransaction: z.string().optional(),
  }),
);

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
  baseFee: z.string(),
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

export const WalletExportSchema = z.object({
  eoa: z.object({
    organizationId: z.string(),
    activityId: z.string(),
    needsApproval: z.boolean(),
    fingerprint: z.string(),
    exportBundle: z.string().optional(),
    privateKey: z.string().optional(),
  }),
});

export const ApproveExportWalletSchema = z.object({
  timestamp: z.string(),
  organizationId: z.string(),
  fingerprint: z.string(),
  stamped: stampedActivitySchema,
});

export const ApproveExportWalletResponseSchema = z.object({
  status: z.string(),
  exportBundle: z.string().optional(),
});

export const WalletRecoveryByEmailStatus = z.object({
  status: z.enum(['ENABLE', 'DISABLE']),
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

export const ExecRecoverySchema = z.object({
  timestamp: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  authenticator: z
    .object({ authenticatorName: z.string() })
    .merge(PasskeyAuthenticationSchema),
  stamped: stampedActivitySchema,
});

export const ExecRecoveryResponseSchema = z.object({
  status: z.string(),
});

export const ApproveAndRejectSignTxSchema = z.object({
  address: EthereumAddressSchema,
  timestamp: z.string(),
  organizationId: z.string(),
  fingerprint: z.string(),
  stamped: stampedActivitySchema,
});

export const RpcBodyRequest = z.object({
  method: z.enum([
    'eth_blockNumber',
    'eth_getBalance',
    'eth_call',
    'eth_getTransactionReceipt',
    'eth_estimateGas',
    'eth_getTransactionCount',
    'eth_feeHistory',
    'eth_gasPrice',
    'net_version',
  ]),
  params: z
    .array(z.union([z.object({}).passthrough(), z.string(), z.number()]))
    .optional(),
});
export const RpcParamsRequest = z.object({
  chainId: ChainIdSchema,
});
export const RpcResponse = z.union([
  z.string(),
  z.number(),
  z.object({}).passthrough(),
  z.array(z.object({}).passthrough()),
]);

export const WalletAuthenticatorConsentSchema = z.object({
  fingerprint: z.string(),
  organizationId: z.string(),
  timestamp: z.string(),
  stamped: stampedActivitySchema,
});

export const WalletRecoveryApproveSchema = z.object({
  fingerprint: z.string(),
  organizationId: z.string(),
  timestamp: z.string(),
  stamped: stampedActivitySchema,
});

export const WalletAuthenticatorConsentResponseSchema = z.object({
  status: z.string(),
});

export const WalletRecoveryApproveResponseSchema = z.object({
  status: z.string(),
});

export type IWalletAuthenticatorConsentSchema = z.infer<
  typeof WalletAuthenticatorConsentSchema
>;

export type IWalletRecoveryApproveSchema = z.infer<
  typeof WalletRecoveryApproveSchema
>;

export type IWalletAuthenticatorConsentResponseSchema = z.infer<
  typeof WalletAuthenticatorConsentResponseSchema
>;

export type IWalletRecoveryApproveResponseSchema = z.infer<
  typeof WalletRecoveryApproveResponseSchema
>;

export type IRpcBodyRequest = z.infer<typeof RpcBodyRequest>;
export type IRpcParamsRequest = z.infer<typeof RpcParamsRequest>;
export type IRpcResponse = z.infer<typeof RpcResponse>;

export type TApproveAndRejectSignTxRequest = z.infer<
  typeof ApproveAndRejectSignTxSchema
>;
export type IWallet = z.infer<typeof WalletSchema>;
export type IWalletAPI = z.infer<typeof WalletSchemaAPI>;
export type IWalletResponse = z.infer<typeof WalletResponseSchema>;
export type IWalletSignMessage = z.infer<typeof WalletSignMessageSchema>;
export type IWalletSignMessageResponse = z.infer<
  typeof WalletSignMessageResponseSchema
>;
export type IWalletSignTransaction = z.infer<
  typeof WalletSignTransactionSchema
>;
export type IWalletSignTransactionResponse = z.infer<
  typeof WalletSignTransactionResponseSchema
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
export type IWalletExport = z.infer<typeof WalletExportSchema>;
export type IApproveExportWalletSchema = z.infer<
  typeof ApproveExportWalletSchema
>;
export type IApproveExportWalletResponseSchema = z.infer<
  typeof ApproveExportWalletResponseSchema
>;
export type IWalletRecoveryByEmailStatus = z.infer<
  typeof WalletRecoveryByEmailStatus
>;
export type IWalletPortfolio = z.infer<typeof WalletPortfolioSchema>;
export type IWalletNotifications = z.infer<typeof WalletNotificationsSchema>;
export type TStampedActivitySchema = z.infer<typeof stampedActivitySchema>;
export type IExecRecoveryRequest = z.infer<typeof ExecRecoverySchema>;
export type IExecRecovery = z.infer<typeof ExecRecoveryResponseSchema>;
export type IWalletAuthenticator = z.infer<typeof WalletAuthenticator>;
export type IDeleteWalletAuthenticator = z.infer<
  typeof DeleteWalletAuthenticator
>;
export type ICreateWalletAuthenticatorResponse = z.infer<
  typeof CreateWalletAuthenticatorResponse
>;
export type IWalletAuthenticatorResponse = z.infer<
  typeof WalletAuthenticatorResponse
>;
export type IDeleteWalletAuthenticatorResponse = z.infer<
  typeof DeleteWalletAuthenticatorResponse
>;
export type ISetRecoveryByEmailStatusResponse = z.infer<
  typeof SetRecoveryByEmailStatusResponse
>;
