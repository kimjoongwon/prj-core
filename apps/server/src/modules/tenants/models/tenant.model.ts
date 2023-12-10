import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Role } from '../../roles/models/role.model';
import { User } from '../../users/models/user.model';
import { Space } from '../../spaces/models/space.model';
import { Relation } from '../../../common/types';
import { TenantEntity } from './tenant.entity';

@ObjectType()
@InputType('TenantInputType')
export class Tenant extends TenantEntity {
  @Field(type => Role, { nullable: true })
  role?: Role;

  @Field(type => User, { nullable: true })
  user?: Relation<User>;

  @Field(type => Space, { nullable: true })
  space?: Space;
}
