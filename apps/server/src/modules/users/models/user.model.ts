import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@common';
import { Profile } from '@modules/profiles/entities/profile.entity';

@ObjectType()
export class User extends BaseEntity {
  @Field()
  email: string;

  @Field(() => Profile)
  profile?: Profile;
}
