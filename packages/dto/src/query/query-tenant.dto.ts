import { EnumFieldOptional } from "@cocrepo/decorator";
import { SortOrder } from "@cocrepo/enum";
import { QueryDto } from "./query.dto";

export class QueryTenantDto extends QueryDto {
	@EnumFieldOptional(() => SortOrder)
	createdAtSortOrder?: SortOrder;
}
