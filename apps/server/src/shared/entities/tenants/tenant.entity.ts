import { Tenant as TenantEntity } from '@prisma/client';
import { AbstractEntity } from '../common/entities/abstract.entity';
import { User } from '../users/user.entity';
import { Space } from '../spaces/space.entity';
import { Role } from '../roles/role.entity';

export class Tenant extends AbstractEntity implements TenantEntity {
  userId: string;
  roleId: string;
  spaceId: string;

  user?: User;
  space?: Space;
  role?: Role;
}
