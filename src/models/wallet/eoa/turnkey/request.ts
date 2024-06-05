import { z } from 'zod';
import { AuthenticationTypeSchema, validAddressFormats } from './common';

// Schemas
export const CreateTurnkeyWalletRequestSchema = z.object({
  walletName: z.string(),
  walletFormat: validAddressFormats,
  authenticationType: AuthenticationTypeSchema,
});

// Types
export type TCreateTurnkeyWalletRequestSchema = z.infer<
  typeof CreateTurnkeyWalletRequestSchema
>;
