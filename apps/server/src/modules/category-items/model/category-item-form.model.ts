import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoryItemForm {
  @Field(type => String)
  name: string;

  @Field(type => String)
  tag: string;

  @Field(type => [String])
  ancestorIds: string[];

  @Field(type => String, { nullable: true })
  parentId: string;
}
