import { $Enums, Prisma } from "@prisma/client";
import { EnumFieldOptional, StringFieldOptional } from "../../decorator/field";
import { QueryDto } from "./query.dto";

export class QueryCategoryDto extends QueryDto {
	@StringFieldOptional()
	name?: string;

	@EnumFieldOptional(() => $Enums.CategoryTypes)
	type?: $Enums.CategoryTypes;

	@StringFieldOptional()
	parentId?: string;

	@StringFieldOptional()
	tenantId?: string;

	@StringFieldOptional()
	serviceId?: string;

	@EnumFieldOptional(() => Prisma.SortOrder, { default: Prisma.SortOrder })
	nameSortOrder?: Prisma.SortOrder;
}
