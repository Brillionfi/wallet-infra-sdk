import { z } from 'zod';

export enum ConfigKeys {
  BASE_URL = 'BASE_URL',
}

export const ConfigSchema = z.object({
  [ConfigKeys.BASE_URL]: z.string().url(),
});

export type IConfig = z.infer<typeof ConfigSchema>;
