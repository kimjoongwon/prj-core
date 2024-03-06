import { z } from 'nestjs-zod/z';

export const useSchemas = () => {
  return {
    categoryItemSchema: z.object({
      name: z.string(),
    }),
  };
};
