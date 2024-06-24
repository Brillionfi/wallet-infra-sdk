import z from 'zod';
export enum AuthProvider {
  GOOGLE = 'Google',
}

export const AuthProviderSchema = z.nativeEnum(AuthProvider);
