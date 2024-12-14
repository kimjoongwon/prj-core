import { $Enums, Category } from '@prisma/client';
import { AbstractEntity } from '../common/entities/abstract.entity';

export class CategoryEntity extends AbstractEntity implements Category {
  type: $Enums.CategoryTypes;
  name: string;
  parentId: string;
  tenantId: string;
  serviceId: string;
}
