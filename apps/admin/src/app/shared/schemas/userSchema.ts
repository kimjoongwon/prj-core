import { z } from 'nestjs-zod/z';

export const userSchema = z.object({
  email: z.string().email('유효하지 않은 이메일'),
  name: z.string().min(3, '최소 3글자 이상 입력해주세요.'),
  nickname: z.string().optional() || z.never().optional(),
  password: z
    .string()
    .refine(
      value =>
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
          value,
        ),
      '유효하지 않은 비밀번호입니다.',
    ),
  phone: z.string().optional() || z.never().optional(),
  roleId: z.string().optional() || z.never().optional(),
  spaceId: z.string().optional() || z.never().optional(),
});

export type UserSchema = typeof userSchema;
