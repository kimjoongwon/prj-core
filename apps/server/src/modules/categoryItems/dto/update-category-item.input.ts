import { InputType, PartialType } from '@nestjs/graphql';
import { CategoryItem } from '../model/category-item.entity';

@InputType()
export class UpdateCategoryItemInput extends PartialType(
  CategoryItem,
  InputType,
) {}
