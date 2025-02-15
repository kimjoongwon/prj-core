import { $Enums, Role as RoleEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { RoleDto } from '../dtos';
import { Tenant } from './tenant.entity';

@UseDto(RoleDto)
export class Role extends AbstractEntity<RoleDto> implements RoleEntity {
  name: $Enums.Roles;
  tenantId: string;
  tenant: Tenant;
}
