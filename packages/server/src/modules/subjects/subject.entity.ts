import { z } from 'nestjs-zod/z';
import { CommonEntitySchema } from '../../schemas';
import { createZodDto } from 'nestjs-zod';
import { Subject } from '@coc/database';

export const sujectEntitySchema = z
  .object({
    name: z.string(),
  })
  .merge(CommonEntitySchema);

export class SubjectEntity
  extends createZodDto(sujectEntitySchema)
  implements Subject {}
