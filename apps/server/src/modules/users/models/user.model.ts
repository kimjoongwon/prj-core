import { Field, ObjectType } from '@nestjs/graphql';
import { Base } from '@common';
import { Profile } from '@modules/profiles/entities/profile.entity';

@ObjectType()
export class User extends Base {
  @Field()
  email: string;

  @Field(() => Profile)
  profile?: Profile;
}
