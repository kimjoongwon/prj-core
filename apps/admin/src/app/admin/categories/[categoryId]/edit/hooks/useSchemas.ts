import { z } from 'nestjs-zod/z';

export const useSchemas = () => {
  const categoryFormSchema = z.object({
    name: z.string().min(1).max(10),
    categoryItemId: z.string().nullable(),
  });

  return {
    categoryFormSchema,
  };
};
