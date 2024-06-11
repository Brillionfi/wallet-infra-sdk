import { z } from 'zod';
import { getAddress, isAddress } from 'ethers';

export enum SUPPORTED_CHAINS {
  ETHEREUM = '1',
  ETHEREUM_SEPOLIA = '11155111',
  POLYGON = '137',
  POLYGON_AMOY = '2002',
}

export const SUPPORTED_CHAINS_VALUES = [
  SUPPORTED_CHAINS.ETHEREUM,
  SUPPORTED_CHAINS.ETHEREUM_SEPOLIA,
  SUPPORTED_CHAINS.POLYGON,
  SUPPORTED_CHAINS.POLYGON_AMOY,
] as const;

export const EthereumAddressSchema = z
  .string()
  .refine((value) => isAddress(value))
  .transform((value) => getAddress(value));

export const ChainIdSchema = z.enum(SUPPORTED_CHAINS_VALUES);

// Types
export type Address = z.infer<typeof EthereumAddressSchema>;
export type ChainId = z.infer<typeof ChainIdSchema>;
