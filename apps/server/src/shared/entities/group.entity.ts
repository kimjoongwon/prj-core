import { Group as GroupEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { Service } from './service.entity';
import { Association } from './association.entity';
import { Tenancy } from './tenancy.entity';

export class Group extends AbstractEntity implements GroupEntity {
  name: string;
  serviceId: string;
  tenancyId: string;

  service?: Service;
  associations?: Association[];
  tenancy?: Tenancy;
}
