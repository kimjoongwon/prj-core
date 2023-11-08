import { Base } from '@common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Group extends Base {
  @Field(type => String)
  name: string;

  @Field(type => String)
  serviceId: string;

  @Field(type => String)
  categoryId: string;
}
