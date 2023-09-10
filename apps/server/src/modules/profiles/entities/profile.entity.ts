import { BaseEntity } from '@common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Profile extends BaseEntity {
  @Field()
  phone: string;

  @Field()
  nickname: string;
}
