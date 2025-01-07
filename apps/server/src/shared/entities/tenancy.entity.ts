import { Tenancy as TenancyEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { Space } from './space.entity';
import { Group } from './group.entity';
import { Category } from './category.entity';
import { Classification } from './classification.entity';
import { Association } from './association.entity';
import { User } from './user.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { TenancyDto } from '../dtos';

@UseDto(TenancyDto)
export class Tenancy extends AbstractEntity<TenancyDto> implements TenancyEntity {
  spaceId: string;

  space?: Space;
  groups?: Group[];
  categories?: Category[];
  classifications?: Classification[];
  associations?: Association[];
  users?: User[];
  // posts?: Post[];
}
