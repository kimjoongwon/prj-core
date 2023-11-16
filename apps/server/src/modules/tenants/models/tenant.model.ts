import { Base } from '@common';
import { Space } from '@modules/spaces/models';
import { User } from '@modules/users/models';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Tenant extends Base {
  @Field(type => User)
  user: User;

  @Field(type => Space)
  space: Space;
}
