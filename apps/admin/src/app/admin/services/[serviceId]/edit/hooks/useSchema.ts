import { z } from 'zod';

export const useSchemas = () => {
  return {
    serviceSchema: z.object({
      name: z.string().min(1).max(10),
    }),
  };
};
