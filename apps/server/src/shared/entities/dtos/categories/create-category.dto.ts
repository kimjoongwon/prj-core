import { OmitType } from '@nestjs/swagger';
import { CategoryEntity } from '../../models/category.entity';

export class CreateCategoryDto extends OmitType(CategoryEntity, [
  'createdAt',
  'deletedAt',
  'id',
  'updatedAt',
]) {}
