import { Base } from '@common';
import { User } from '@modules/users/models/user.model';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Space extends Base {
  @Field(type => String)
  name: string;

  @Field(type => String)
  phone: string;

  @Field(type => String)
  address: string;

  @Field(type => String)
  ownerId: string;

  @Field(type => User)
  owner: User;
}
