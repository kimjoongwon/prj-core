import { z } from 'nestjs-zod/z';

export const useSchemas = () => {
  const sessionFormSchema = z.object({
    name: z.string().min(1).max(10),
  });

  return {
    sessionFormSchema,
  };
};

