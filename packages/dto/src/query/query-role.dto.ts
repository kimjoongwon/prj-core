import { EnumFieldOptional } from "@cocrepo/decorator";
import { SortOrder } from "@cocrepo/enum";
import { QueryDto } from "./query.dto";

export class QueryRoleDto extends QueryDto {
	@EnumFieldOptional(() => SortOrder)
	nameSortOrder?: SortOrder;

	@EnumFieldOptional(() => SortOrder)
	createdAtSortOrder?: SortOrder;
}
