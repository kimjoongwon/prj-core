import { PartialType } from '@nestjs/swagger';
import { CategoryEntity } from '../../entities';

export class UpdateCategoryDto extends PartialType(CategoryEntity) {}
