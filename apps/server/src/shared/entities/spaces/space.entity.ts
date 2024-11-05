import { Space as SpaceEntity } from '@prisma/client';
import { AbstractEntity } from '../common/abstract.entity';

export class Space extends AbstractEntity implements SpaceEntity {
  name: string;
  classificationId: string | null;
  assignmentIds: string[];
}
