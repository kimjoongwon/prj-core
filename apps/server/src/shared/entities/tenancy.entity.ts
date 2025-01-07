import { Tenancy as TenancyEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { Space } from './space.entity';
import { Group } from './group.entity';
import { Category } from './category.entity';
import { Classification } from './classification.entity';
import { Association } from './association.entity';
import { User } from './user.entity';
// import { Post } from './post.entity';

export class Tenancy extends AbstractEntity implements TenancyEntity {
  spaceId: string;

  space?: Space;
  groups?: Group[];
  categories?: Category[];
  classifications?: Classification[];
  associations?: Association[];
  users?: User[];
  // posts?: Post[];
}
