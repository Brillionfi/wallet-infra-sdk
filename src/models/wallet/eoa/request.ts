import { z } from 'zod';
import { CreateTurnkeyWalletRequestSchema } from './turnkey';

export const EOARequestSchema = z.union([
  CreateTurnkeyWalletRequestSchema,
  z.undefined(),
]);

// Types
export type TEOARequest = z.infer<typeof EOARequestSchema>;
