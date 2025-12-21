import { EnumFieldOptional, UUIDFieldOptional } from "@cocrepo/decorator";
import { Prisma } from "@cocrepo/prisma";
import { QueryDto } from "./query.dto";

export class QueryFileAssociationDto extends QueryDto {
  @UUIDFieldOptional()
  userId: string;

  @UUIDFieldOptional()
  fileId: string;

  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder: Prisma.SortOrder;
}
