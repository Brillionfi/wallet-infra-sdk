import z from 'zod';

export enum AuthProvider {
  GOOGLE = 'Google',
  SANDBOX = 'Sanbox',
}

export const AuthProviderSchema = z.nativeEnum(AuthProvider);
