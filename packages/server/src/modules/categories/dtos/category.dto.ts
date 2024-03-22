import { z } from 'nestjs-zod/z';
import { spaceDtoSchmea } from '../../spaces/dto/space.dto';
import { createZodDto } from 'nestjs-zod';
import { serviceDtoSchema } from '../../services/dtos/service.dto';

export const categoryDtoSchema = z.object({
  space: spaceDtoSchmea.optional(),
  service: serviceDtoSchema.optionnal(),
});

export class CategoryDto extends createZodDto(categoryDtoSchema) {}
