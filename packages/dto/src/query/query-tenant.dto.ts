import { Prisma } from "@cocrepo/prisma";
import { EnumFieldOptional } from "@cocrepo/decorator";
import { QueryDto } from "./query.dto";

export class QueryTenantDto extends QueryDto {
	@EnumFieldOptional(() => Prisma.SortOrder)
	createdAtSortOrder?: Prisma.SortOrder;
}
