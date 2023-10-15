import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateCategoryInput } from './create-category.input';
import { Category } from '../models/category.model';

@InputType()
export class UpdateCategoryInput extends PartialType(Category, InputType) {
  @Field(type => String)
  id: string;
}
