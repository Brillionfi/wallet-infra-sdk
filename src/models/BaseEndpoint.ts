import { z } from 'zod';

export const AxiosRequestSchema = z.object({
  url: z.string(),
  method: z.string(),
  data: z.record(z.string(), z.any()).optional(), // check later
  params: z.record(z.string(), z.any()).optional(), // check later
});

export type TAxiosRequestSchema = z.infer<typeof AxiosRequestSchema>;
