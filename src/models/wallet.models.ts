import { z } from 'zod';

export enum WalletKeys {
  TYPE = 'type',
  ADDRESS = 'address',
  NAME = 'name',
  FORMAT = 'format',
  OWNER = 'owner',
  AUTHENTICATION_TYPE = 'authenticationType',
}

export enum WalletTypes {
  EOA = 'eoa',
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
    [WalletTypes.EOA]: z
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

export const WalletNonceSchemaAPI = z.object({
  nonce: z.number(),
});

export type IWallet = z.infer<typeof WalletSchema>;
export type IWalletAPI = z.infer<typeof WalletSchemaAPI>;
export type IWalletNonceAPI = z.infer<typeof WalletNonceSchemaAPI>;
export type IWalletResponse = z.infer<typeof WalletResponseSchema>;
