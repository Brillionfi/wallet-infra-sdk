import { z } from 'zod';
import { validAddressFormats } from './common';

// Schemas
export const CreateTurnkeyWalletResponseSchema = z.object({
  subOrganizationId: z.string(),
  wallet: z.object({
    walletId: z.string(),
    walletAddress: z.string(),
    walletFormat: validAddressFormats,
  }),
});

// Types
export type TCreateTurnkeyWalletResponseSchema = z.infer<
  typeof CreateTurnkeyWalletResponseSchema
>;
