import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCategoryItemInput {
  @Field(type => String)
  name: string;

  @Field(type => String)
  parentId: string;
}
