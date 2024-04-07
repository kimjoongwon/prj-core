import { z } from 'nestjs-zod/z';
import { commonSchema } from '../../schema/common.schema';

export const userEntitySchema = z
  .object({
    email: z.string().email(),
    name: z.string().min(3, '최소 3글자 이상'),
    phone: z.string(),
    password: z.string(),
  })
  .merge(commonSchema);
