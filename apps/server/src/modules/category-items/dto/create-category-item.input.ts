import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCategoryItemInput {
  @Field(type => String)
  name: string;

  @Field(type => String)
  tag: string;

  @Field(type => [String])
  ancestorIds: string[];

  @Field(type => String, { nullable: true })
  parentId: string;
}
