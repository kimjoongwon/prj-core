import { Tenant as TenantEntity } from '@prisma/client';
import { AbstractEntity } from '../common/entities/abstract.entity';

export class Tenant extends AbstractEntity implements TenantEntity {
  userId: string;
  roleId: string;
  spaceId: string;
  active: boolean;
}
