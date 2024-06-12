import { z } from 'zod';
import { getAddress, isAddress } from 'ethers';

export enum SUPPORTED_CHAINS {
  ETHEREUM = '1',
  ETHEREUM_SEPOLIA = '11155111',
  POLYGON = '137',
  POLYGON_AMOY = '2002',
  SOLANA = '1399811149',
  TRON = '728126428',
  COSMOS = '0',
}

export const EthereumAddressSchema = z
  .string()
  .refine((value) => isAddress(value))
  .transform((value) => getAddress(value));

export const ChainIdSchema = z.nativeEnum(SUPPORTED_CHAINS);

// Types
export type Address = z.infer<typeof EthereumAddressSchema>;
export type ChainId = z.infer<typeof ChainIdSchema>;
