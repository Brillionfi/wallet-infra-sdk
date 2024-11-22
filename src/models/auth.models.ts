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
