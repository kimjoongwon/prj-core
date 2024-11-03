import { EnumFieldOptional, StringFieldOptional } from '../../../decorators/field.decorators';
import { $Enums, Prisma } from '@prisma/client';
import { PageQueryDto } from '../../common';

export class CategoryQueryDto extends PageQueryDto {
  @StringFieldOptional()
  name?: string;

  @EnumFieldOptional(() => $Enums.CategoryTypes)
  type?: $Enums.CategoryTypes;

  @StringFieldOptional({ each: true })
  ancestorIds?: string[];

  @StringFieldOptional()
  parentId?: string;

  @StringFieldOptional()
  serviceId?: string;

  @EnumFieldOptional(() => Prisma.SortOrder, { default: Prisma.SortOrder })
  nameSortOrder?: Prisma.SortOrder;
}
