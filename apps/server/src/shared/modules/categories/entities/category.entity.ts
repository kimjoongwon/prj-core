import { Category } from '@prisma/client';
import { AbstractEntity } from '@shared';

export class CategoryEntity extends AbstractEntity implements Category {
  name: string;
  ancestorIds: string[];
  parentId: string | null;
  spaceId: string;
  serviceId: string;
}
