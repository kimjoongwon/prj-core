import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const UserLoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export class UserLoginDto extends createZodDto(UserLoginSchema) {}
