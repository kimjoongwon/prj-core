import { Base } from '@common';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Category extends Base {
  @Field(type => ID)
  name: string;

  @Field(type => String, { nullable: true })
  categoryItemId: string;

  @Field(type => String, { nullable: true })
  serviceId: string;
}
