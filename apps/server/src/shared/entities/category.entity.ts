import { $Enums, Category as CategoryEntity } from '@prisma/client';
import { AbstractEntity } from './common/entities/abstract.entity';
import { Space } from '../spaces/space.entity';
import { Service } from './service.entity';
import { User } from './user.entity';

export class Category extends AbstractEntity implements CategoryEntity {
  name: string;
  type: $Enums.CategoryTypes;
  parentId: string;
  spaceId: string;
  serviceId: string;

  parent?: Category;
  children?: Category[];
  space?: Space;
  user?: User;
  service?: Service;
}
