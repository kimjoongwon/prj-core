import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSpaceInput {
  @Field(type => String)
  name: string;

  @Field(type => String)
  ownerId: string;

  @Field(type => String)
  phone: string;

  @Field(type => String)
  address: string;
}
