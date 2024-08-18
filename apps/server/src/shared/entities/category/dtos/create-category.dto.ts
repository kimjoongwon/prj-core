import { OmitType } from '@nestjs/swagger';
import { CategoryEntity } from '../category.entity';

export class CreateCategoryDto extends OmitType(CategoryEntity, [
  'createdAt',
  'deletedAt',
  'id',
  'updatedAt',
]) {}
