import { BaseEntity } from '@common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Category extends BaseEntity {
  @Field(type => String)
  name: string;

  @Field(type => String, { nullable: true })
  categoryItemId?: string;
}
