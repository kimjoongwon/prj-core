import { z } from 'zod';

export const schema = z.object({
  name: z.string().min(1).max(10),
  categoryId: z.string(),
  parentId: z.string(),
});

export const useSchema = () => {
  return schema;
};
