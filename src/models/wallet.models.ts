import { z } from 'zod';

export enum AuthenticationKeys {
  TURNKEY = 'turnkey',
}

export const PasskeyAuthenticationSchema = z.object({
  challenge: z.string(),
  attestation: z.object({
    credentialId: z.string(),
    clientDataJson: z.string(),
    attestationObject: z.string(),
    transports: z.array(
      z.enum([
        'AUTHENTICATOR_TRANSPORT_BLE',
        'AUTHENTICATOR_TRANSPORT_INTERNAL',
        'AUTHENTICATOR_TRANSPORT_NFC',
        'AUTHENTICATOR_TRANSPORT_USB',
        'AUTHENTICATOR_TRANSPORT_HYBRID',
      ]),
    ),
  }),
});

export const AuthenticationSchema = z.object({
  [AuthenticationKeys.TURNKEY]: PasskeyAuthenticationSchema,
});

export enum WalletKeys {
  WALLET_TYPE = 'walletType',
  WALLET_ADDRESS = 'walletAddress',
  WALLET_NAME = 'walletName',
  WALLET_FORMAT = 'walletFormat',
  WALLET_OWNER = 'walletOwner',
  AUTHENTICATION_TYPE = 'authenticationType',
}

export const WalletSchema = z.object({
  [WalletKeys.WALLET_ADDRESS]: z.string().optional(),
  [WalletKeys.WALLET_TYPE]: z.string(),
  [WalletKeys.WALLET_NAME]: z.string(),
  [WalletKeys.WALLET_FORMAT]: z.string(),
  [WalletKeys.WALLET_OWNER]: z.string().optional(),
  [WalletKeys.AUTHENTICATION_TYPE]: AuthenticationSchema.optional(),
});

export type IWallet = z.infer<typeof WalletSchema>;
