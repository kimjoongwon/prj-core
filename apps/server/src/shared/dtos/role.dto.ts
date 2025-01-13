import { $Enums, Role } from '@prisma/client';
import { ClassField, EnumField } from '../decorators/field.decorators';
import { AbstractDto } from './abstract.dto';
import { TenantDto } from './tenant.dto';

export class RoleDto extends AbstractDto implements Role {
  @EnumField(() => $Enums.Roles)
  name: $Enums.Roles;

  @ClassField(() => TenantDto, { required: false })
  tenant?: TenantDto;
}
