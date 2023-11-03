import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CreateServiceInput {
  @Field(type => String)
  name: string;

  @Field(type => Float)
  createdAt: number;
}
