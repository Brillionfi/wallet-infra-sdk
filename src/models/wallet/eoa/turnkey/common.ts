import { z } from 'zod';

// Schemas
export const AttestationSchema = z.object({
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
});

export const WalletAddressFormatSchema = z.array(
  z.object({
    curve: z.enum(['CURVE_SECP256K1', 'CURVE_ED25519']),
    pathFormat: z.enum(['PATH_FORMAT_BIP32']),
    path: z.string(),
    addressFormat: z.enum([
      'ADDRESS_FORMAT_ETHEREUM',
      'ADDRESS_FORMAT_UNCOMPRESSED',
      'ADDRESS_FORMAT_COMPRESSED',
      'ADDRESS_FORMAT_SOLANA',
      'ADDRESS_FORMAT_COSMOS',
      'ADDRESS_FORMAT_TRON',
    ]),
  }),
);

export const WalletSchema = z.object({
  walletName: z.string(),
  accounts: WalletAddressFormatSchema,
});

export const PasskeyAuthenticationSchema = z.object({
  challenge: z.string(),
  attestation: AttestationSchema,
});

export const AuthenticationTypeSchema = PasskeyAuthenticationSchema; // TODO: use zod union to add more authentication types

export const RootUserSchema = z.array(
  z.object({
    userName: z.string(),
    userEmail: z.string(),
    authenticators: z.array(
      z.object({
        authenticatorName: z.string(),
        challenge: z.string(),
        attestation: AttestationSchema,
      }),
    ),
    apiKeys: z.array(
      z.object({
        apiKeyName: z.string(),
        publicKey: z.string(),
      }),
    ),
  }),
);

export const validAddressFormats = z.enum([
  'ethereum',
  'solana',
  'cosmos',
  'tron',
]);

export const CreateSubOrganization = z.object({
  userName: z.string(),
  email: z.string(),
  walletName: z.string(),
  walletFormat: validAddressFormats,
  authenticationType: AuthenticationTypeSchema,
});

export const CreateSubOrganizationParamsSchema = z.object({
  subOrganizationName: z.string(),
  rootQuorumThreshold: z.number(),
  rootUsers: RootUserSchema,
  wallet: WalletSchema,
});

export const CreateSubOrganizationResultSchema = z.object({
  subOrganizationId: z.string(),
  wallet: z.object({
    walletId: z.string(),
    addresses: z.array(z.string()),
  }),
  rootUserIds: z.array(z.string()).optional(),
});

// Types
export type TAttestation = z.infer<typeof AttestationSchema>;
export type TWalletAddressFormat = z.infer<typeof WalletAddressFormatSchema>;
export type TWallet = z.infer<typeof WalletSchema>;
export type TRootUser = z.infer<typeof RootUserSchema>;
export type TPasskeyAuthentication = z.infer<
  typeof PasskeyAuthenticationSchema
>;
export type TAuthenticationType = z.infer<typeof AuthenticationTypeSchema>;
export type TValidAddressFormats = z.infer<typeof validAddressFormats>;
export type TCreateSubOrganization = z.infer<typeof CreateSubOrganization>;
export type TCreateSubOrganizationParams = z.infer<
  typeof CreateSubOrganizationParamsSchema
>;
