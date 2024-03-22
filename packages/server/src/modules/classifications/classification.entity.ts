import { z } from 'nestjs-zod/z';
import { CommonEntitySchema } from '../../schemas';
import { createZodDto } from 'nestjs-zod';
import { Classification } from '@coc/database';

export const ClassificationEntitySchema = z
  .object({
    serviceId: z.string(),
    serviceItemId: z.string(),
    categoryId: z.string(),
  })
  .merge(CommonEntitySchema);

export class ClassificationEntity
  extends createZodDto(ClassificationEntitySchema)
  implements Classification {}
