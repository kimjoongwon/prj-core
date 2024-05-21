import { Tenant } from '@prisma/client';
import { AbstractEntity } from '../../entities';

export class TenantEntity extends AbstractEntity implements Tenant {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  userId: string;
  spaceId: string;
  roleId: string;
}
