import { z } from 'zod';
import { EOARequestSchema } from './eoa/request';

// Schemas
export const CreateWalletSchema = z.object({
  eoa: EOARequestSchema,
});

export const CreateWalletBodySchema = z.object({
  walletType: CreateWalletSchema,
});

// Types
export type TCreateWallet = z.infer<typeof CreateWalletSchema>;
export type TCreateWalletBody = z.infer<typeof CreateWalletBodySchema>;
