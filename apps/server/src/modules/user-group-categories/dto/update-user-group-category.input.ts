import { CreateUserGroupCategoryInput } from './create-user-group-category.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserGroupCategoryInput extends PartialType(
  CreateUserGroupCategoryInput,
) {
  @Field(() => Int)
  id: number;
}
