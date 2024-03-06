import { z } from 'nestjs-zod/z';

export const useSchemas = () => {
  const timelineItemFormSchema = z.object({
    title: z.string().min(1).max(10),
  });

  return {
    timelineItemFormSchema,
  };
};
