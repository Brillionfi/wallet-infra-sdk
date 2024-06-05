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

export const GetWalletsResponseSchema = z.object({
  body: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      format: z.string(),
      owner: z.string(),
      address: z.string(),
    }),
  ),
});

// Types
export type TData = z.infer<typeof DataSchema>;
export type TCreateWalletResponse = z.infer<typeof CreateWalletResponseSchema>;
export type TGetWalletsResponse = z.infer<typeof GetWalletsResponseSchema>;
export type TProviderData = z.infer<typeof ProviderDataResponseSchema>;
