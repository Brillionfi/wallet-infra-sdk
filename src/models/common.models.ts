import { z } from 'zod';
import { getAddress, isAddress } from 'ethers';

export enum SUPPORTED_CHAINS {
  ETHEREUM = '1',
  ETHEREUM_SEPOLIA = '11155111',
  POLYGON = '137',
  POLYGON_AMOY = '80002',
  BASE = '8453',
  BASE_SEPOLIA = '84532',
  SOLANA = '1399811149',
  SOLANA_TESTNET = '901',
  TRON = '728126428',
  TRON_TESTNET = '1001',
  COSMOS = '0',
  VANAR = '2040',
  VANAR_VANGUARD = '78600',
  TELOS = '40',
  TELOS_TESTNET = '41',
  ZILLIQA2_PROTO_TESTNET = '33103',
  ZILLIQA = '32769',
  ZILLIQA_TESTNET = '33101',
  AVALANCHE = '43114',
  AVALANCHE_FUJI_TESTNET = '43113',
  ARBITRUM = '42161',
  ARBITRUM_TESTNET = '421614',
}

export const EthereumAddressSchema = z
  .string()
  .refine((value) => isAddress(value))
  .transform((value) => getAddress(value));

export const ChainIdSchema = z.nativeEnum(SUPPORTED_CHAINS);

export const non0xString = z
  .string()
  .refine((value) => !value.startsWith('0x'));

// Types
export type Address = z.infer<typeof EthereumAddressSchema>;
export type ChainId = z.infer<typeof ChainIdSchema>;
