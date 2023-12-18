import { z } from 'zod';

export const testScheme = z.object({
  name: z.string().min(3),
});
