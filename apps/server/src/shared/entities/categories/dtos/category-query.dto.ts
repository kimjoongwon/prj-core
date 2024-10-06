import { EnumFieldOptional, StringFieldOptional } from '../../../decorators/field.decorators';
import { Prisma } from '@prisma/client';
import { PageQueryDto } from '../../common';

class CategorySortOrder extends PageQueryDto {
  @EnumFieldOptional(() => Prisma.SortOrder, { default: Prisma.SortOrder })
  nameSortOrder?: Prisma.SortOrder;
}

export class CategoryQueryDto extends CategorySortOrder {
  @StringFieldOptional()
  name?: string;

  @StringFieldOptional({ each: true })
  ancestorIds?: string[];

  @StringFieldOptional()
  parentId?: string;
}
