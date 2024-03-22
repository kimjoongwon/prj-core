import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { classificationDtoSchema } from '../../classifications/dtos/classification.dto';
import { assignmentDtoSchema } from '../../assignments/dtos/assignment.dto';
import { categoryDtoSchema } from '../../categories/dtos/category.dto';
import { serviceEntitySchema } from '../service.entity';

export const serviceDtoSchema = z
  .object({
    classifications: z.array(classificationDtoSchema).optional(),
    assignments: z.array(assignmentDtoSchema).optional(),
    categories: z.array(categoryDtoSchema).optional(),
  })
  .merge(serviceEntitySchema);

export class ServiceDto extends createZodDto(serviceDtoSchema) {}
