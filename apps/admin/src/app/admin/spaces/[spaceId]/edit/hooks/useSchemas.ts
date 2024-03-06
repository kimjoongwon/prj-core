import { z } from 'nestjs-zod/z';

export const useSchemas = () => {
  const spaceFormSchema = z.object({
    name: z.string().min(1).max(10),
    phone: z.string(),
    address: z.string().min(1).max(10),
  });

  return {
    spaceFormSchema,
  };
};
