import { EnumFieldOptional } from "@cocrepo/decorator";
import { SortOrder } from "@cocrepo/enum";
import { QueryDto } from "./query.dto";

export class QueryUserDto extends QueryDto {
	@EnumFieldOptional(() => SortOrder)
	createdAtSortOrder: SortOrder;
}
