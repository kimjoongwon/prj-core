import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateWorkspaceInput {
  @Field(type => String)
  name: string;

  @Field(type => String)
  phone: string;

  @Field(type => String)
  address: string;

  @Field(type => String)
  businessNumber: string;
}
