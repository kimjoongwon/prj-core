import { z } from 'nestjs-zod/z';

export const useSchemas = () => {
  const roleFormSchema = z.object({
    name: z.enum(['USER', 'SUPER_ADMIN']),
  });

  return {
    roleFormSchema,
  };
};
