import { QueryDto } from '../../common/dtos/query.dto';
import { Prisma } from '@prisma/client';
import { EnumFieldOptional, StringFieldOptional } from '../../../decorators/field.decorators';

class PageSortOrder extends QueryDto {
  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder: Prisma.SortOrder;
}

export class CPageQueryDto extends PageSortOrder {
  @StringFieldOptional({ nullable: true })
  name?: string;
}
