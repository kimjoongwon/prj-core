import { createZodDto } from 'nestjs-zod';
import { categoryEntitySchema } from '../entities/category.entity';

export class CategoryDto extends createZodDto(categoryEntitySchema) {}
