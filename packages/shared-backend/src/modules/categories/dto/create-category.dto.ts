import { z } from 'nestjs-zod/z';
import { CategoryEntity } from '../entities/category.entity';
import { createZodDto } from 'nestjs-zod';

export const createCategoryDtoScheme: z.ZodType<
  Omit<CategoryEntity, 'createdAt' | 'deletedAt' | 'updatedAt' | 'id'>
> = z.object({
  name: z.string(),
  ancestorIds: z.array(z.string()),
  parentId: z.string().nullable(),
  spaceId: z.string(),
});

export class CreateCategoryDto extends createZodDto(createCategoryDtoScheme) {}
