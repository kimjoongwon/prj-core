import { QueryDto } from './query.dto';
import { Prisma } from '@prisma/client';
import { EnumFieldOptional } from '../../decorators/field.decorators';

class UserSortOrder extends QueryDto {
  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder: Prisma.SortOrder;
}

export class UserQueryDto extends UserSortOrder {}
