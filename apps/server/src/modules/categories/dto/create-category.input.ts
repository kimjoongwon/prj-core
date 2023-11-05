import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
  @Field(type => String)
  name: string;

  @Field(type => String, { nullable: true })
  itemId: string;

  @Field(type => String, { nullable: true })
  serviceId: string;
}
