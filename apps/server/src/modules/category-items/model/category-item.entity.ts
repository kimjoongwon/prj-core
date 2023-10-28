import { Base } from '@common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoryItem extends Base {
  @Field(type => String)
  name: string;

  @Field(type => String)
  parentId: string;
}
