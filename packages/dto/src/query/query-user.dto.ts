import { Prisma } from "@prisma/client";
import { EnumFieldOptional } from "@cocrepo/decorator";
import { QueryDto } from "./query.dto";

export class QueryUserDto extends QueryDto {
	@EnumFieldOptional(() => Prisma.SortOrder)
	createdAtSortOrder: Prisma.SortOrder;
}
