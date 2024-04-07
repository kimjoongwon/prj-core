import { createZodDto } from 'nestjs-zod';
import { categoryEntitySchema } from '../entities/category.entity';

export const updateCategoryDtoSchema = categoryEntitySchema.partial();

export class UpdateCategoryDto extends createZodDto(updateCategoryDtoSchema) {}
