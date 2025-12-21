import { EnumFieldOptional, StringFieldOptional } from "@cocrepo/decorator";
import { CategoryTypes, Prisma } from "@cocrepo/prisma";
import { QueryDto } from "./query.dto";

export class QueryCategoryDto extends QueryDto {
  @StringFieldOptional()
  name?: string;

  @EnumFieldOptional(() => CategoryTypes)
  type?: CategoryTypes;

  @StringFieldOptional()
  parentId?: string;

  @StringFieldOptional()
  tenantId?: string;

  @StringFieldOptional()
  serviceId?: string;

  @EnumFieldOptional(() => Prisma.SortOrder, { default: Prisma.SortOrder })
  nameSortOrder?: Prisma.SortOrder;
}
