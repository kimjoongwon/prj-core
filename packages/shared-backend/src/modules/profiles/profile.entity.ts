import { z } from 'nestjs-zod/z';
import { commonSchema } from '../../schema/common.schema';
import { createZodDto } from 'nestjs-zod';

export const prorfileEntitySchema = z
  .object({
    nickname: z.string().min(3, '최소 3글자 이상'),
    userId: z.string(),
  })
  .merge(commonSchema);

export class ProfileEntity extends createZodDto(prorfileEntitySchema) {}
