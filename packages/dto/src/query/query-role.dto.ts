import { Prisma } from "@cocrepo/prisma";
import { EnumFieldOptional } from "@cocrepo/decorator";
import { QueryDto } from "./query.dto";

export class QueryRoleDto extends QueryDto {
	@EnumFieldOptional(() => Prisma.SortOrder)
	nameSortOrder?: Prisma.SortOrder;

	@EnumFieldOptional(() => Prisma.SortOrder)
	createdAtSortOrder?: Prisma.SortOrder;
}
