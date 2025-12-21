import { Prisma, CategoryTypes } from "@prisma/client";
import { EnumFieldOptional, StringFieldOptional } from "@cocrepo/decorator";
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
