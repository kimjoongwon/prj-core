import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CategoryItem } from '../model';

@InputType()
export class UpdateCategoryItemInput extends PartialType(
  CategoryItem,
  InputType,
) {
  @Field(type => ID!)
  id: string;
}
