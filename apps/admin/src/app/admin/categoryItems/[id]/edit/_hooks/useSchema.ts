import { z } from 'zod';

export const useSchemas = () => {
  return {
    categoryItemSchema: z.object({
      name: z.string(),
    }),
  };
};
