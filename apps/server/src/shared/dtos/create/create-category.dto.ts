import { OmitType } from '@nestjs/swagger';
import { COMMON_ENTITY_FIELDS } from '../../../constants';
import { CategoryDto } from '../../../dtos/category.dto';

export class CreateCategoryDto extends OmitType(CategoryDto, [
  ...COMMON_ENTITY_FIELDS,
  'children',
  'parent',
  'space',
  'service',
]) {}
