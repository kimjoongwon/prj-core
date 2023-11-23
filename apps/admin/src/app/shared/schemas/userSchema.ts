import { CreateUserInput } from '@__generated__/graphql';
import { toZod } from 'tozod';
import { z } from 'zod';

interface Test {
  name: string;
}

export const userSchema: toZod<CreateUserInput> = z.object({
  email: z.string().email('유효하지 않은 이메일'),
  name: z.string().min(3, '최소 3글자 이상 입력해주세요.'),
  nickname: z.string().optional() || z.never().optional(),
  password: z.string(),
  phone: z.string().optional() || z.never().optional(),
  roleId: z.string().optional() || z.never().optional(),
  spaceId: z.string().optional() || z.never().optional(),
});

export type UserSchema = typeof userSchema;
