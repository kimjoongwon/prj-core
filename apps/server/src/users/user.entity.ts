import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonEntitySchema } from 'src/common/zodSchemas/common-entity.schema';
import { User } from '@coc/database';

export const UserEntitySchema = z
  .object({
    email: z.string(),
    password: z.string(),
    name: z.string(),
    phone: z.string(),
  })
  .merge(CommonEntitySchema);

export class UserEntity
  extends createZodDto(UserEntitySchema)
  implements User {}
