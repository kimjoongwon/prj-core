import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Tenant as CoCTenant } from '@prisma/client';
import { Base } from '../../../common/interfaces';

@ObjectType()
@InputType('TenantInputType')
export class TenantEntity extends Base implements CoCTenant {
  @Field(type => String)
  roleId: string;

  @Field(type => String)
  userId: string;

  @Field(type => String)
  spaceId: string;
}
