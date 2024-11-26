import z from 'zod';
import { ChainIdSchema } from './common.models';

export enum TokenStatusKeys {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum TokenTypeKeys {
  NATIVE = 'NATIVE',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}

export enum TokenKeys {
  CHAIN_ID = 'chainId',
  TOKEN_ID = 'tokenId',
  STATUS = 'status',
  NAME = 'name',
  ADDRESS = 'address',
  TYPE = 'type',
  LOGO = 'logo',
  SYMBOL = 'symbol',
  DECIMALS = 'decimals',
  CONTRACT_ABI = 'contractABI',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  UPDATED_BY = 'updatedBy',
  TOKEN_PRICE_USD = 'tokenPriceUsd',
}

export const TokenSchema = z.object({
  [TokenKeys.CHAIN_ID]: ChainIdSchema,
  [TokenKeys.TOKEN_ID]: z.string(),
  [TokenKeys.STATUS]: z.nativeEnum(TokenStatusKeys),
  [TokenKeys.NAME]: z.string(),
  [TokenKeys.ADDRESS]: z.string(),
  [TokenKeys.TYPE]: z.nativeEnum(TokenTypeKeys),
  [TokenKeys.LOGO]: z.string(),
  [TokenKeys.DECIMALS]: z.number().optional(),
  [TokenKeys.SYMBOL]: z.string().optional(),
  [TokenKeys.CONTRACT_ABI]: z.string(),
  [TokenKeys.CREATED_AT]: z.string(),
  [TokenKeys.UPDATED_AT]: z.string(),
  [TokenKeys.UPDATED_BY]: z.string(),
  [TokenKeys.TOKEN_PRICE_USD]: z.string().optional(),
});

export type IToken = z.infer<typeof TokenSchema>;
