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
  EOA = 'EOA',
}
export const WalletTypesSchema = z.nativeEnum(WalletTypes);

export enum WalletFormats {
  ETHEREUM = 'ethereum',
  SOLANA = 'solana',
  COSMOS = 'cosmos',
  TRON = 'tron',
}
export const WalletFormatsSchema = z.nativeEnum(WalletFormats);

export enum AuthenticationTypes {
  TURNKEY = 'turnkey',
}
export const AuthenticationTypesSchema = z.nativeEnum(AuthenticationTypes);

export const TurnkeyAuthenticationSchema = z.object({
  challenge: z.string(),
  attestation: z.object({
    credentialId: z.string(),
    clientDataJson: z.string(),
    attestationObject: z.string(),
    transports: z.array(z.string()),
  }),
});

export const AuthenticationDataSchema = TurnkeyAuthenticationSchema; // z.union when more auth types are added

export const WalletSchema = z.object({
  [WalletKeys.ADDRESS]: z.string().optional(),
  [WalletKeys.TYPE]: WalletTypesSchema,
  [WalletKeys.NAME]: z.string(),
  [WalletKeys.FORMAT]: WalletFormatsSchema,
  [WalletKeys.OWNER]: z.string().optional(),
  [WalletKeys.AUTHENTICATION_TYPE]: AuthenticationTypesSchema.optional(),
});

export const WalletSchemaAPI = z.object({
  walletType: z.object({
    [WalletTypes.EOA.toLocaleLowerCase()]: z
      .object({
        walletName: z.string(),
        walletFormat: WalletFormatsSchema,
        authenticationType: TurnkeyAuthenticationSchema,
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
  }),
);

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
export type IAuthenticationTypes = z.infer<typeof AuthenticationTypesSchema>;
export type IAuthenticationData = z.infer<typeof AuthenticationDataSchema>;
export type IWalletResponse = z.infer<typeof WalletResponseSchema>;
export type IWalletGasConfiguration = z.infer<
  typeof WalletGasConfigurationSchema
>;
export type IWalletGasConfigurationAPI = z.infer<
  typeof WalletGasConfigurationResponseSchema
>;
export type IWalletNonceAPI = z.infer<typeof WalletNonceResponseSchema>;
