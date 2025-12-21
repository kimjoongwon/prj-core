import { EnumFieldOptional } from "@cocrepo/decorator";
import { SortOrder } from "@cocrepo/enum";
import { QueryDto } from "./query.dto";

export class QueryServiceDto extends QueryDto {
	@EnumFieldOptional(() => SortOrder)
	nameSortOrder?: SortOrder;
}
