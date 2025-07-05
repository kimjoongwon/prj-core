import { Prisma } from '@prisma/client';
import { QueryDto } from './query.dto';
import { EnumFieldOptional } from '../../decorator/field.decorators';

export class QueryRoleDto extends QueryDto {
  @EnumFieldOptional(() => Prisma.SortOrder)
  nameSortOrder?: Prisma.SortOrder;

  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder?: Prisma.SortOrder;
}
