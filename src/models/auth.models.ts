import z from 'zod';

export enum AuthProvider {
  GOOGLE = 'Google',
  TWITTER = 'Twitter',
  DISCORD = 'Discord',
  APPLE = 'Apple',
  SANDBOX = 'Sandbox',
}

export const AuthProviderSchema = z.nativeEnum(AuthProvider);
