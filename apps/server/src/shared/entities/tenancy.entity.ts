import { Tenancy as TenancyEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { Space } from './space.entity';

export class Tenancy extends AbstractEntity implements TenancyEntity {
  spaceId: string;
  space?: Space;
}

const tenancy = new Tenancy();
tenancy.space.classification;
