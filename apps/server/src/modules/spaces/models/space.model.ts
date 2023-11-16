import { Base } from '@common';
import { User } from '@modules/users/models';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Space extends Base {
  @Field(type => String)
  name: string;

  @Field(type => User)
  owner: User;

  @Field(type => String)
  phone: string;

  @Field(type => String)
  address: string;
}
