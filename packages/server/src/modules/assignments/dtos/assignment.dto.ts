import { z } from 'nestjs-zod/z';
import { serviceDtoSchema } from '../../services/dtos/service.dto';
import { groupDtoSchema } from '../../groups/dtos/group.dto';
import { createZodDto } from 'nestjs-zod';

export const assignmentDtoSchema = z.object({
  group: groupDtoSchema.optional(),
  service: serviceDtoSchema.optional(),
});

export class AssignmentDto extends createZodDto(
  assignmentDtoSchema,
) {}
