import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { Relation } from '../../../common/types';
import { UserEntity } from './user.entity';
import { Profile } from '../../profiles/models/profile.model';
import { Tenant } from '../../tenants/models/tenant.model';

@ObjectType()
@InputType('UserInputType')
export class User extends UserEntity {
  @Field(type => [Profile])
  profiles: Relation<Profile>[];

  @Field(type => [Tenant])
  tenants: Relation<Tenant>[];
}
