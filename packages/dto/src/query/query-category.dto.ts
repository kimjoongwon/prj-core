import { EnumFieldOptional, StringFieldOptional } from "@cocrepo/decorator";
import { SortOrder } from "@cocrepo/enum";
import { CategoryTypes } from "@cocrepo/prisma";
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

	@EnumFieldOptional(() => SortOrder)
	nameSortOrder?: SortOrder;
}
