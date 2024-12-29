import { $Enums, Category } from '@prisma/client';
import { AbstractEntity } from '../common/entities/abstract.entity';

export class CategoryEntity extends AbstractEntity implements Category {
  name: string;
  type: $Enums.CategoryTypes;
  parentId: string;
  spaceId: string;
  serviceId: string;
}
