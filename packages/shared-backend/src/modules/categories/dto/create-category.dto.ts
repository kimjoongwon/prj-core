import { createZodDto } from 'nestjs-zod';
import { categoryEntitySchema } from '../entities/category.entity';

export const createCategoryDtoSchema = categoryEntitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export class CreateCategoryDto extends createZodDto(createCategoryDtoSchema) {}
