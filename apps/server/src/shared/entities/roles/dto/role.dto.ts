import { $Enums } from '@prisma/client';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Role } from '../role.entity';
import { ClassField, EnumField } from '../../../decorators/field.decorators';
import { TenantDto } from '../../tenant';

export class RoleDto extends AbstractDto implements Role {
  @EnumField(() => $Enums.Roles)
  name: $Enums.Roles;

  @ClassField(() => TenantDto, { each: true, nullable: true, swagger: false })
  tenant?: TenantDto;
}
