import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { Category } from '../models/category.model';
import { BASE_FIELDS } from '../../../common/constants';

@InputType()
export class CreateCategoryInput extends OmitType(
  Category,
  [...BASE_FIELDS, 'categoryItem', 'service'],
  InputType,
) {}
