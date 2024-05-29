import { PartialType } from '@nestjs/swagger';
import { CategoryEntity } from '../../models/category.entity';

export class UpdateCategoryDto extends PartialType(CategoryEntity) {}
