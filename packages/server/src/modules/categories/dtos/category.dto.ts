import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { serviceDtoSchema } from '../../services/dtos/service.dto';
import { spaceDtoSchmea } from '../../spaces/dtos/space.dto';

export const categoryDtoSchema = z.object({
  space: spaceDtoSchmea.optional(),
  service: serviceDtoSchema.optionnal(),
});

export class CategoryDto extends createZodDto(categoryDtoSchema) {}
