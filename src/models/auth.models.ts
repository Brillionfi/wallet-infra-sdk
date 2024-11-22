import z from 'zod';

export enum AuthProvider {
  GOOGLE = 'Google',
  TWITTER = 'Twitter',
  DISCORD = 'Discord',
  APPLE = 'Apple',
  SANDBOX = 'Sandbox',
  WALLET_CONNECT = 'WalletConnect',
  METAMASK = 'Metamask',
  EMAIL = 'Email',
}

export const AuthProviderSchema = z.nativeEnum(AuthProvider);

export const AuthURLParams = z.object({
  provider: AuthProviderSchema,
  redirectUrl: z.string(),
  email: z.string().optional(),
  sessionId: z.string().optional(),
  signedMessage: z.string().optional(),
});

export type IAuthURLParams = z.infer<typeof AuthURLParams>;
