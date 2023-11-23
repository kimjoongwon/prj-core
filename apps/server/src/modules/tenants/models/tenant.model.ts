import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Tenant as CoCTenant } from '@prisma/client';
import { Role } from '../../roles/models/role.model';
import { User } from '../../users/models/user.model';
import { Space } from '../../spaces/models/space.model';
import { Base } from '../../../common/interfaces';

@ObjectType()
@InputType('TenantInputType')
export class Tenant extends Base implements CoCTenant {
  @Field(type => String)
  roleId: string;

  @Field(type => Role, { nullable: true })
  role?: Role;

  @Field(type => String)
  userId: string;

  @Field(type => User, { nullable: true })
  user?: User;

  @Field(type => String)
  spaceId: string;

  @Field(type => Space, { nullable: true })
  space?: Space;
}
