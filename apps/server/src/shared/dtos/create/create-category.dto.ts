import { CategoryEntity } from '../../entities';
import { OmitType } from '@nestjs/swagger';

export class CreateCategoryDto extends OmitType(CategoryEntity, [
  'createdAt',
  'deletedAt',
  'id',
  'updatedAt',
]) {}
