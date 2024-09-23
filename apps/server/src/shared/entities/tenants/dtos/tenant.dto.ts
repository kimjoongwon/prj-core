import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Tenant } from '../tenants.entity';
import { $Enums } from '@prisma/client';
import { TenancyDto } from '../../tenancies';
import { RoleDto } from '../../roles/dto/role.dto';
import {
  BooleanField,
  ClassField,
  EnumField,
  StringField,
  UUIDField,
} from '../../../decorators/field.decorators';
import { UserDto } from '../../users';

export class TenantDto extends AbstractDto implements Tenant {
  @StringField()
  userId: string;

  @StringField()
  roleId: string;

  constructor(tenant: Tenant) {
    super(tenant);
    Object.assign(this, tenant);
  }

  @UUIDField()
  tenancyId: string;

  @BooleanField()
  active: boolean;

  @EnumField(() => $Enums.TenantTypes)
  type: $Enums.TenantTypes;

  @ClassField(() => TenancyDto, { nullable: true })
  tenancy: TenancyDto | null;

  @ClassField(() => RoleDto, { nullable: true })
  role: RoleDto | null;

  @ClassField(() => UserDto, { nullable: true })
  user: UserDto | null;
}
