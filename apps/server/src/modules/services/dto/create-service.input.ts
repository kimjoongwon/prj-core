import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateServiceInput {
  @Field(type => String)
  name: string;
}
