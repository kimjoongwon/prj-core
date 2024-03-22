import { z } from 'nestjs-zod/z';
import { CommonEntitySchema } from '../../schemas/common-entity.schema';
import { createZodDto } from 'nestjs-zod';
import { Group } from '@coc/database';

export const groupEntitySchema = z
  .object({
    name: z.string(),
    serviceId: z.string(),
    spaceId: z.string(),
  })
  .merge(CommonEntitySchema);

export class GroupEntity
  extends createZodDto(groupEntitySchema)
  implements Group {}
