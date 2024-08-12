import z from 'zod';

export enum AuthProvider {
  GOOGLE = 'Google',
  SANDBOX = 'Sandbox',
}

export const AuthProviderSchema = z.nativeEnum(AuthProvider);
