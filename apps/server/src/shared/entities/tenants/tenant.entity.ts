import { $Enums, Tenant } from '@prisma/client';
import { AbstractEntity } from '../common/abstract.entity';

export class TenantEntity extends AbstractEntity implements Tenant {
  userId: string;
  roleId: string;
  tenancyId: string;
  active: boolean;
  type: $Enums.TenantTypes;
}
