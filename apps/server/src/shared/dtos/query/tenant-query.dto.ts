import { Prisma } from '@prisma/client';
import { EnumFieldOptional } from '../../decorators/field.decorators';
import { QueryDto } from './query.dto';

export class TenantQueryDto extends QueryDto {
  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder?: Prisma.SortOrder;
}
