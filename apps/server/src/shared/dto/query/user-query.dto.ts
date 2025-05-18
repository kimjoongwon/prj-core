import { Prisma } from '@prisma/client';
import { EnumFieldOptional } from '../../decorator/field.decorators';
import { QueryDto } from './query.dto';

export class UserQueryDto extends QueryDto {
  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder: Prisma.SortOrder;
}
