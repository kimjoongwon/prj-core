import { Prisma } from '@prisma/client';
import { QueryDto } from './query.dto';
import { EnumFieldOptional } from '../../decorators/field.decorators';

export class RoleQueryDto extends QueryDto {
  @EnumFieldOptional(() => Prisma.SortOrder)
  nameSortOrder?: Prisma.SortOrder;

  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder?: Prisma.SortOrder;
}
