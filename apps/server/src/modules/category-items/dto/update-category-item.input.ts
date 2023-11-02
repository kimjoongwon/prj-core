import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CategoryItem } from '../model';

@InputType()
export class UpdateCategoryItemInput extends PartialType(
  CategoryItem,
  InputType,
) {
  @Field(type => String)
  id: string;
}
