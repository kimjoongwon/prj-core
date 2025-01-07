import { AbstractEntity } from './abstract.entity';
import { Tenant as TenantEntity } from '@prisma/client';
import { Space } from './space.entity';
import { User } from './user.entity';
// import { Role } from './role.entity';

export class Tenant extends AbstractEntity implements TenantEntity {
  spaceId: string;
  userId: string;
  roleId: string;

  space?: Space;
  user?: User;
  // role?: Role;
}
