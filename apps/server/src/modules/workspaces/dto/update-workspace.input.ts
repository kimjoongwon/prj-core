import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Workspace } from '../models/workspace.model';

@InputType()
export class UpdateWorkspaceInput extends PartialType(
  Workspace,
  InputType,
) {
  @Field(type => String, { nullable: true })
  id: string;
}
