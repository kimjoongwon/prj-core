import { z } from 'nestjs-zod/z';
import { assignmentDtoSchema } from '../../assignments/dtos/assignment.dto';
import { createZodDto } from 'nestjs-zod';
import { spaceDtoSchmea } from '../../spaces/dtos/space.dto';

export const groupDtoSchema = z.object({
  space: spaceDtoSchmea,
  assignments: z.array(assignmentDtoSchema),
});

export class GroupDto extends createZodDto(groupDtoSchema) {}
