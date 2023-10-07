import { BaseEntity } from '@common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Profile extends BaseEntity {
  @Field(type => String)
  phone: string;

  @Field(type => String)
  nickname: string;

  @Field(type => Int)
  userId: number;
}
