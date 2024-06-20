import { z } from 'zod';

export enum ConfigKeys {
  BASE_URL = 'BASE_URL',
  MAX_RETRIES = 'MAX_RETRIES',
  RETRY_DELAY = 'RETRY_DELAY',
}

export const ConfigSchema = z.object({
  [ConfigKeys.BASE_URL]: z.string().url(),
  [ConfigKeys.MAX_RETRIES]: z.number().optional(),
  [ConfigKeys.RETRY_DELAY]: z.number().optional(),
});

export type IConfig = z.infer<typeof ConfigSchema>;
