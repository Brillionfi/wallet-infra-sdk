import { z } from 'zod';
import { CreateTurnkeyWalletResponseSchema } from './turnkey';

export const EOAResponseSchema = z.union([
  CreateTurnkeyWalletResponseSchema,
  z.undefined(),
]);

export const EOAProviderDataResponse = CreateTurnkeyWalletResponseSchema; // TODO: Should be a union when more providers are added

// Types
export type TEOAResponse = z.infer<typeof EOAResponseSchema>;
