import { z } from 'zod';

export enum ExampleKeys {
  ID = 'id',
  NAME = 'name',
}

export const ExampleSchema = z.object({
  [ExampleKeys.ID]: z.string().optional(),
  [ExampleKeys.NAME]: z.string(),
});

export type IExample = z.infer<typeof ExampleSchema>;
