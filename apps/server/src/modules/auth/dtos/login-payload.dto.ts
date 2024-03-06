import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const LoginPayloadSchema = z
  .object({
    email: z.string().email().describe('The email of the user'),
    password: z.string().describe('The password of the user'),
  })
  .required();

export class LoginPayloadDto extends createZodDto(LoginPayloadSchema) {}
