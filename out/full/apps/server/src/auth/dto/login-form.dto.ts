import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import zodToJsonSchema from 'zod-to-json-schema';

export const loginFormDtoSchema = z.object({
  email: z
    .string()
    .min(1, '필수 항목입니다.')
    .regex(/^.+@.+\..+$/, '올바른 이메일 주소를 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
});

export const loginFormJsonSchema = zodToJsonSchema(loginFormDtoSchema, {
  errorMessages: true,
});

export class LoginFormDto extends createZodDto(loginFormDtoSchema) {}
