import { z } from 'nestjs-zod/z';

import { categoryDtoSchema } from '../../categories/dtos/category.dto';
import { createZodDto } from 'nestjs-zod';
import { serviceDtoSchema } from '../../services/dtos/service.dto';

export const classificationDtoSchema = z.object({
  service: serviceDtoSchema,
  category: categoryDtoSchema,
});

export class ClassificationDto extends createZodDto(
  classificationDtoSchema,
) {}
