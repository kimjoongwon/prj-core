import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateWorkspaceInput {
  @Field(type => String)
  name: string;
}
