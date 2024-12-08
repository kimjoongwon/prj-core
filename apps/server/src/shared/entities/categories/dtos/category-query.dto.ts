import { EnumFieldOptional, StringFieldOptional } from '../../../decorators/field.decorators';
import { Prisma } from '@prisma/client';
import { PageQueryDto } from '../../common';

export class CategoryQueryDto extends PageQueryDto {
  @StringFieldOptional()
  name?: string;

  @StringFieldOptional({ each: true })
  ancestorIds?: string[];

  @StringFieldOptional()
  parentId?: string;

  @StringFieldOptional()
  serviceId?: string;

  @EnumFieldOptional(() => Prisma.SortOrder, { default: Prisma.SortOrder })
  nameSortOrder?: Prisma.SortOrder;
}
