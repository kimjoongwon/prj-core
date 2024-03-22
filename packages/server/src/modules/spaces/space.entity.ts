import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { CommonEntitySchema } from '../../schemas/common-entity.schema';
import { Space } from '@prisma/client';

export const spaceEntitySchema = z
  .object({
    name: z.string(),
  })
  .merge(CommonEntitySchema);

export class SpaceEntitySchema
  extends createZodDto(spaceEntitySchema)
  implements Space {}
