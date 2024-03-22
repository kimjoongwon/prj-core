import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { Profile } from '@coc/database';
import { CommonEntitySchema } from '../../schemas/common-entity.schema';

export const ProfileEntitySchema = z
  .object({
    nickname: z.string(),
    userId: z.string(),
  })
  .merge(CommonEntitySchema);

export class ProfileEntity
  extends createZodDto(ProfileEntitySchema)
  implements Profile {}
