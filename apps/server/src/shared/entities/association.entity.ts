import { Association as AssociationEntity } from '@prisma/client';
import { User } from './user.entity';
import { Service } from './service.entity';
import { AbstractEntity } from './abstract.entity';
import { Space } from './space.entity';
import { Tenancy } from './tenancy.entity';
import { Group } from './group.entity';
export class Association extends AbstractEntity implements AssociationEntity {
  groupId: string;
  userId: string | null;
  spaceId: string | null;
  serviceId: string;
  tenancyId: string;

  group?: Group;
  user?: User;
  space?: Space;
  service?: Service;
  tenancy?: Tenancy;
}
