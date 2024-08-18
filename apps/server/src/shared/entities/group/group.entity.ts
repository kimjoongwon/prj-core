import { Group } from '@prisma/client';
import { AbstractEntity } from '../common/abstract.entity';

export class GroupEntity extends AbstractEntity implements Group {
  name: string;
  spaceId: string;
  serviceId: string;
}
