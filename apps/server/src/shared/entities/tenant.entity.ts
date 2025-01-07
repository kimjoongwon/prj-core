import { AbstractEntity } from './abstract.entity';
import { Tenant as TenantEntity } from '@prisma/client';
import { Space } from './space.entity';
import { User } from './user.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { TenantDto } from '../dtos';
import { Role } from './role.entity';

@UseDto(TenantDto)
export class Tenant extends AbstractEntity<TenantDto> implements TenantEntity {
  spaceId: string;
  userId: string;
  roleId: string;

  space?: Space;
  user?: User;
  role?: Role;
}
