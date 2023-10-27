import { z } from 'zod';

export const useSchemas = () => {
  return {
    serviceSchema: z.object({
      name: z.string(),
      serviceId: z.string().optional(),
    }),
  };
};
