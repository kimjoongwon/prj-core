import { $Enums, Tenant as TenantEntity } from '@prisma/client';
import { AbstractEntity } from '../common/abstract.entity';

export class Tenant extends AbstractEntity implements TenantEntity {
  userId: string;
  roleId: string;
  active: boolean;
  tenancyId: string;
  type: $Enums.TenantTypes;
}
