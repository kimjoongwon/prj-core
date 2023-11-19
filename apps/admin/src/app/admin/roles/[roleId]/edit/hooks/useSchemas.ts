import { z } from 'zod';

export const useSchemas = () => {
  const roleFormSchema = z.object({
    name: z.enum(['USER', 'SUPER_ADMIN']),
  });

  return {
    roleFormSchema,
  };
};
