import { PartialType } from '@nestjs/swagger';
import { CategoryEntity } from '../category.entity';

export class UpdateCategoryDto extends PartialType(CategoryEntity) {}
