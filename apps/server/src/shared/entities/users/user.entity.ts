import { User as UserEntity } from '@prisma/client';
import { AbstractEntity } from '../common/entities/abstract.entity';
import { Tenant } from '../tenants/tenant.entity';
import { Space } from '../spaces/space.entity';

export class User extends AbstractEntity implements UserEntity {
  email: string;
  name: string;
  phone: string;
  password: string;
  spaceId: string;
  tenantId: string;

  tenant?: Tenant;
  space: Space;
}
