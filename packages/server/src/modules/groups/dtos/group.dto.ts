import { z } from 'nestjs-zod/z';
import { spaceDtoSchmea } from '../../spaces/dto/space.dto';
import { assignmentDtoSchema } from '../../assignments/dtos/assignment.dto';
import { createZodDto } from 'nestjs-zod';

export const groupDtoSchema = z.object({
  space: spaceDtoSchmea.optional(),
  assignments: z.array(assignmentDtoSchema).optional(),
});

export class GroupDto extends createZodDto(groupDtoSchema) {}
