import { CreateUserWorkspaceInput } from './create-user-workspace.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserWorkspaceInput extends PartialType(CreateUserWorkspaceInput) {
  @Field(() => Int)
  id: number;
}
