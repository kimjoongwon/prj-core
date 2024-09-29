import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Tenant } from '../tenant.entity';
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
