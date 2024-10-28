import { $Enums, Category } from '@prisma/client';
import { AbstractEntity } from '../common/abstract.entity';

export class CategoryEntity extends AbstractEntity implements Category {
  name: string;
  type: $Enums.CategoryTypes;
  ancestorIds: string[];
  parentId: string;
  tenantId: string;
  serviceId: string;
}
