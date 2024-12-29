import { Group } from '@prisma/client';
import { AbstractEntity } from '../common/entities/abstract.entity';

export class GroupEntity extends AbstractEntity implements Group {
  name: string;
  serviceId: string;
  spaceId: string;
}
