import { z } from 'nestjs-zod/z';

export const useSchemas = () => {
  const groupFormSchema = z.object({
    name: z.string().min(1).max(10),
  });

  return {
    groupFormSchema,
  };
};
