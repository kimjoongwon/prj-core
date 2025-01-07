import { Space as SpaceEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { Classification } from './classification.entity';
import { Association } from './association.entity';
import { Tenancy } from './tenancy.entity';
import { Tenant } from './tenant.entity';

export class Space extends AbstractEntity implements SpaceEntity {
  name: string;
  classificationId: string | null;

  classification?: Classification;
  associations?: Association[];
  tenancy?: Tenancy;
  tenants?: Tenant[];
}
