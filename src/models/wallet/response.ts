import { z } from 'zod';
import { EOAProviderDataResponse } from './eoa';

// Schemas
export const DataSchema = z.object({
  eoa: z.object({
    walletAddress: z.string(),
    walletFormat: z.string(),
    walletType: z.string(),
    walletName: z.string(),
  }),
});

export const CreateWalletResponseSchema = DataSchema;

export const ProviderDataResponseSchema = EOAProviderDataResponse; // TODO: Should be a union when more providers are added

// Types
export type TData = z.infer<typeof DataSchema>;
export type TCreateWalletResponse = z.infer<typeof CreateWalletResponseSchema>;
export type TProviderData = z.infer<typeof ProviderDataResponseSchema>;
