import { z } from 'nestjs-zod/z';
import { CommonEntitySchema } from '../../schemas';
import { createZodDto } from 'nestjs-zod';
import { Assignment } from '@coc/database';

export const assignmentEntitySchema = z
  .object({
    groupId: z.string(),
    serviceId: z.string(),
    serviceItemId: z.string(),
  })
  .merge(CommonEntitySchema);

export class AssignmentEntity
  extends createZodDto(assignmentEntitySchema)
  implements Assignment {}
