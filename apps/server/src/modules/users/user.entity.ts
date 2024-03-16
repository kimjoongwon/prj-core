import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { User } from '@prisma/client';
import { CommonEntitySchema } from 'src/common/schemas/common-entity.schema';

export const UserEntitySchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
    phone: z.string(),
  })
  .merge(CommonEntitySchema);

export class UserEntity
  extends createZodDto(UserEntitySchema)
  implements User {}
