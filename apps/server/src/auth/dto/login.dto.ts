import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import zodToJsonSchema from 'zod-to-json-schema';

export const loginSchema = z
  .object({
    email: z.string().email().describe('The email of the user'),
    password: z.string().describe('The password of the user'),
  })
  .required();

export class LoginDto extends createZodDto(loginSchema) {}

export const loginJsonSchema = zodToJsonSchema(loginSchema);
