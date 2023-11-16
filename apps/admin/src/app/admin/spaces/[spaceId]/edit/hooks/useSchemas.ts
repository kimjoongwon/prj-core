import { z } from 'zod';

export const useSchemas = () => {
  const { spaceFormSchema } = z.object({
    name: z.string().min(1).max(10),
  });

  return {
    spaceFormSchema,
  };
};

