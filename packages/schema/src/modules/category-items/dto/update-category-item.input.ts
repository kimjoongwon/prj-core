import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateCategoryItemInput } from './create-category-item.input';
@InputType()
export class UpdateCategoryItemInput extends PartialType(
  CreateCategoryItemInput,
  InputType,
) {
  @Field(type => ID!)
  id: string;
}
