import { InputType, OmitType } from '@nestjs/graphql';
import { BASE_FIELDS } from '../../../common/constants';
import { CategoryItem } from '../model/category-item.model';

@InputType()
export class CreateCategoryItemInput extends OmitType(
  CategoryItem,
  BASE_FIELDS,
  InputType,
) {}
