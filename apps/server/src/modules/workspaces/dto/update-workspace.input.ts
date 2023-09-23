import { CreateWorkspaceInput } from './create-workspace.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWorkspaceInput extends PartialType(
  CreateWorkspaceInput,
  InputType,
) {
  @Field(() => String)
  id: string;
}
