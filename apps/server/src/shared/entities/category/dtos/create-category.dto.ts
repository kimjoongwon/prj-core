import { OmitType } from '@nestjs/swagger';
import { CategoryEntity } from '../category.entity';
import { COMMON_ENTITY_FIELDS } from '../../../constants';

export class CreateCategoryDto extends OmitType(CategoryEntity, COMMON_ENTITY_FIELDS) {}
