import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTestTestInput {
  @Field(type => String)
  name: string;
}
