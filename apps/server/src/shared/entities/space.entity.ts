import { Space as SpaceEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { Classification } from './classification.entity';

export class Space extends AbstractEntity implements SpaceEntity {
  name: string;
  classificationId: string;
  classification?: Classification;
}
