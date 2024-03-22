import { z } from 'nestjs-zod/z';
import { serviceDtoSchema } from '../../services/dtos/service.dto';
import { categoryDtoSchema } from '../../categories/dtos/category.dto';
import { createZodDto } from 'nestjs-zod';

export const classificationDtoSchema = z.object({
  service: serviceDtoSchema.optional(),
  category: categoryDtoSchema.optional(),
});

export class ClassificationDto extends createZodDto(
  classificationDtoSchema,
) {}
