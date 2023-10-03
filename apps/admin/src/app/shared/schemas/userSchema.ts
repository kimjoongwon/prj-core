import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  profile: z.object({
    nickname: z.string(),
    phone: z.string(),
  }),
});

export type UserSchema = typeof userSchema;
