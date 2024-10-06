import { Category } from '@prisma/client';
import { AbstractEntity } from '../common/abstract.entity';

export class CategoryEntity extends AbstractEntity implements Category {
  tenantId: string;
  name: string;
  ancestorIds: string[];
  parentId: string | null;
  serviceId: string;
}
