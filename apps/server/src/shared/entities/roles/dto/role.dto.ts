import { $Enums } from '@prisma/client';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { TenantDto } from '../../tenants';
import { Role } from '../role.entity';
import { ClassField, EnumField } from '../../../decorators/field.decorators';

export class RoleDto extends AbstractDto implements Role {
  @EnumField(() => $Enums.Roles)
  name: $Enums.Roles;

  @ClassField(() => TenantDto, { required: false })
  tenant?: TenantDto;
}
