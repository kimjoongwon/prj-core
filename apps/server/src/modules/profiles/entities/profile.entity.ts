import { Base } from '@common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Profile extends Base {
  @Field(type => String)
  phone: string;

  @Field(type => String)
  nickname: string;

  @Field(type => Int)
  userId: number;
}
