import { Tenancy as TenancyEntity } from '@prisma/client';
import { AbstractEntity } from '../common/abstract.entity';

export class Tenancy extends AbstractEntity implements TenancyEntity {
  spaceId: string;
}
