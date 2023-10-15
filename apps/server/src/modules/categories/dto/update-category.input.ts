import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Category } from '../models/category.model';

@InputType()
export class UpdateCategoryInput extends PartialType(Category, InputType) {
  @Field(type => String)
  id: string;
}
