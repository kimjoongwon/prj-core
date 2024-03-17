import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { Profile } from '@prisma/client';
import { CommonEntitySchema } from 'src/schemas';

export const ProfileEntitySchema = z
  .object({
    nickname: z.string(),
    phone: z.string(),
    userId: z.string(),
  })
  .merge(CommonEntitySchema);

export class ProfileEntity
  extends createZodDto(ProfileEntitySchema)
  implements Profile {}
