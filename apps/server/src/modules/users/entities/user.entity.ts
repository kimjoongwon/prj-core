import { Field, ObjectType } from '@nestjs/graphql';
import { Profile } from '../../profiles/entities/profile.entity';
import { BaseEntity, Paginated } from '@common';

@ObjectType()
export class User extends BaseEntity {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  profile: Profile;
}
