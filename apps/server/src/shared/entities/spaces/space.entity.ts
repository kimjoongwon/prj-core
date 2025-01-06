import { Space as SpaceEntity } from '@prisma/client';
import { AbstractEntity } from '../common/entities/abstract.entity';

export class Space extends AbstractEntity implements SpaceEntity {
  name: string;
}
