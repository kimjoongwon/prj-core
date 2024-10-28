import { AbstractEntity } from '../common';
import { Classification as ClassificationEntity } from '@prisma/client';
export class Classification extends AbstractEntity implements ClassificationEntity {
  postId: string;
  depotFileId: string;
  userId: string;
  spaceId: string;
  categoryId: string;
}
