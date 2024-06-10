import { z } from 'zod';

export enum WalletKeys {
  WALLET_TYPE = 'walletType',
  WALLET_ADDRESS = 'walletAddress',
  WALLET_NAME = 'walletName',
  WALLET_FORMAT = 'walletFormat',
  WALLET_OWNER = 'walletOwner',
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
  [WalletKeys.WALLET_ADDRESS]: z.string().optional(),
  [WalletKeys.WALLET_TYPE]: z.string(),
  [WalletKeys.WALLET_NAME]: z.string(),
  [WalletKeys.WALLET_FORMAT]: z.string(),
  [WalletKeys.WALLET_OWNER]: z.string().optional(),
  [WalletKeys.AUTHENTICATION_TYPE]: PasskeyAuthenticationSchema.optional(),
});

export const WalletSchemaAPI = z.object({
  [WalletKeys.WALLET_TYPE]: z.object({
    eoa: z
      .object({
        walletName: z.string(),
        walletFormat: z.string(),
        authenticationType: PasskeyAuthenticationSchema,
      })
      .optional(),
  }),
});

export const WalletsSchemaAPI = z.array(
  z.object({
    name: z.string(),
    type: z.string(),
    format: z.string(),
    owner: z.string(),
    address: z.string(),
  }),
);

export const WalletNonceSchemaAPI = z.object({
  nonce: z.number(),
});

export type IWallet = z.infer<typeof WalletSchema>;
export type IWalletAPI = z.infer<typeof WalletSchemaAPI>;
export type IWallets = z.infer<typeof WalletsSchemaAPI>;
export type IWalletNonceAPI = z.infer<typeof WalletNonceSchemaAPI>;
