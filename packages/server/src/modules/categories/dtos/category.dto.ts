import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { spaceDtoSchmea } from '../../spaces/dtos/space.dto';
import { serviceDtoSchema } from '../../services/dtos/service.dto';

export const categoryDtoSchema = z.object({
  space: spaceDtoSchmea,
  service: serviceDtoSchema,
});

export class CategoryDto extends createZodDto(categoryDtoSchema) {}
