import { z } from 'zod';

export const schema = z.object({
  name: z.string().min(5).max(10),
  categoryItemId: z.string(),
});

export const useSchema = () => {
  return schema;
};
