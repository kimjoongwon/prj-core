import { BaseEntity } from '@common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoryItem extends BaseEntity {
  @Field(type => String)
  name: string;

  @Field(type => String)
  parentId: string;
}
