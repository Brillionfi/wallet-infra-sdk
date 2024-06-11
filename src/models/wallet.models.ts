import { z } from 'zod';

export enum WalletKeys {
  TYPE = 'type',
  ADDRESS = 'address',
  NAME = 'name',
  FORMAT = 'format',
  OWNER = 'owner',
  AUTHENTICATION_TYPE = 'authenticationType',
}

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
  [WalletKeys.TYPE]: z.string(),
  [WalletKeys.NAME]: z.string(),
  [WalletKeys.FORMAT]: z.string(),
  [WalletKeys.OWNER]: z.string().optional(),
  [WalletKeys.AUTHENTICATION_TYPE]: PasskeyAuthenticationSchema.optional(),
});

export const WalletSchemaAPI = z.object({
  walletType: z.object({
    eoa: z
      .object({
        walletName: z.string(),
        walletFormat: z.string(),
        authenticationType: PasskeyAuthenticationSchema,
      })
      .optional(),
  }),
});

export const WalletResponseSchema = z.record(
  z.object({
    walletAddress: z.string(),
    walletFormat: z.string(),
    walletType: z.string(),
    walletName: z.string(),
    authenticationType: PasskeyAuthenticationSchema.optional(),
  }),
);

export type IWalletResponse = z.infer<typeof WalletResponseSchema>;
export type IWallet = z.infer<typeof WalletSchema>;
export type IWalletAPI = z.infer<typeof WalletSchemaAPI>;
