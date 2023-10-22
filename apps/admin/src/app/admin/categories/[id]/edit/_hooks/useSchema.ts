import { z } from 'zod';

export const useSchema = () => {
  const schema = z.object({
    name: z.string().min(1).max(10),
    categoryItemId: z.string().nullable(),
  });

  return schema;
};
