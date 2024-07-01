import { z } from 'zod';

export enum ConfigKeys {}

export const ConfigSchema = z.object({});

export type IConfig = z.infer<typeof ConfigSchema>;
