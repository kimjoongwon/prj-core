import { AbstractEntity } from './common';
import { Classification as ClassificationEntity } from '@prisma/client';
import { Service } from './service.entity';
export class Classification extends AbstractEntity implements ClassificationEntity {
  categoryId: string;
  userId: string | null;
  postId: string | null;
  spaceId: string | null;
  roleId: string | null;
  serviceId: string;
  tenancyId: string;

  service: Service;
}
