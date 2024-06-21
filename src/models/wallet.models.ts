import { z } from 'zod';
import { ChainIdSchema, EthereumAddressSchema } from './common.models';

export enum CredentialsProvider {
  GOOGLE = 'Google',
}

export enum WalletKeys {
  TYPE = 'type',
  ADDRESS = 'address',
  NAME = 'name',
  FORMAT = 'format',
  OWNER = 'owner',
  AUTHENTICATION_TYPE = 'authenticationType',
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
  [WalletKeys.AUTHENTICATION_TYPE]: PasskeyAuthenticationSchema.optional(),
});

export const WalletSchemaAPI = z.object({
  walletType: z.object({
    [WalletTypes.EOA.toLocaleLowerCase()]: z
      .object({
        walletName: z.string(),
        walletFormat: WalletFormatsSchema,
        authenticationType: PasskeyAuthenticationSchema,
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
    authenticationType: PasskeyAuthenticationSchema.optional(),
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
  maxFeePerGas: z.string(),
  maxPriorityFeePerGas: z.string(),
});

export const WalletGasConfigurationResponseSchema = z.object({
  status: z.string(),
});

export const WalletNonceResponseSchema = z.object({
  nonce: z.number(),
});

export type IWallet = z.infer<typeof WalletSchema>;
export type IWalletAPI = z.infer<typeof WalletSchemaAPI>;
export type IWalletResponse = z.infer<typeof WalletResponseSchema>;
export type IWalletGasConfiguration = z.infer<
  typeof WalletGasConfigurationSchema
>;
export type IWalletGasConfigurationAPI = z.infer<
  typeof WalletGasConfigurationResponseSchema
>;
export type IWalletNonceAPI = z.infer<typeof WalletNonceResponseSchema>;
export type IWalletTransaction = z.infer<typeof WalletTransactionSchema>;
