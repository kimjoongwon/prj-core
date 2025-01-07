import { Prisma } from '@prisma/client';
import { EnumFieldOptional } from '../../decorators/field.decorators';
import { QueryDto } from './query.dto';

class ClassificationSortOrder extends QueryDto {
  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder: Prisma.SortOrder;
}

export class ClassificationQueryDto extends ClassificationSortOrder {}
