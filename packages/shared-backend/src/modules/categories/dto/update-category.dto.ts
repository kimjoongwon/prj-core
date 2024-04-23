import { PartialType } from '@nestjs/swagger';
import { CategoryEntity } from '../entities/category.entity';

export class UpdateCategoryDto extends PartialType(CategoryEntity) {}
