import { createZodDto } from 'nestjs-zod';
import {
  CategoryEntity,
  categoryEntitySchema,
} from '../entities/category.entity';
import { z } from 'nestjs-zod/z';
import { commonSchema } from '../../../schema/common.schema';

export const updateCategoryDtoSchema: z.ZodType<Partial<CategoryEntity>> = z
  .object({
    name: z.string(),
    ancestorIds: z.array(z.string()),
    parentId: z.string().nullable(),
    spaceId: z.string(),
  })
  .merge(commonSchema)
  .partial();

export class UpdateCategoryDto extends createZodDto(updateCategoryDtoSchema) {}
