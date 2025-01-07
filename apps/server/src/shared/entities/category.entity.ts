import { $Enums, Category as CategoryEntity } from '@prisma/client';
import { Service } from './service.entity';
import { AbstractEntity } from './abstract.entity';
import { Tenancy } from './tenancy.entity';
import { Classification } from './classification.entity';

export class Category extends AbstractEntity implements CategoryEntity {
  name: string;
  type: $Enums.CategoryTypes;
  parentId: string | null;
  serviceId: string;
  tenancyId: string;

  parent?: Category;
  children?: Category[];
  service?: Service;
  tenancy?: Tenancy;
  classification?: Classification;
}
