import { AbstractEntity } from '../common';
import { Classification as ClassificationEntity } from '@prisma/client';
export class Classification extends AbstractEntity implements ClassificationEntity {
  serviceId: string;
  serviceItemId: string;
  categoryId: string;
}
