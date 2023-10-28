import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserServiceInput {
  @Field(type => String)
  name: string;
}
