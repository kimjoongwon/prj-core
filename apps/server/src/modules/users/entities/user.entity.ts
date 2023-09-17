import { Field, ObjectType } from '@nestjs/graphql';
import { Profile } from '../../profiles/entities/profile.entity';
import { BaseEntity } from '@common';

@ObjectType()
export class User extends BaseEntity {
  @Field()
  email: string;

  @Field()
  profile?: Profile;
}
