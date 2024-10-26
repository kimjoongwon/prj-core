import { AbstractEntity } from '../common';
import { Classification as ClassificationEntity } from '@prisma/client';
export class Classification extends AbstractEntity implements ClassificationEntity {
  userId: string;
  spaceId: string;
  categoryId: string;
}
