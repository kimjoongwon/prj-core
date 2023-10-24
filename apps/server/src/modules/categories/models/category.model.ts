import { BaseEntity } from '@common';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Category extends BaseEntity {
  @Field(type => ID)
  name: string;

  @Field(type => String, { nullable: true })
  categoryItemId: string;

  @Field(type => String, { nullable: true })
  serviceId: string;
}
