import { EnumFieldOptional, UUIDFieldOptional } from "@cocrepo/decorator";
import { SortOrder } from "@cocrepo/enum";
import { QueryDto } from "./query.dto";

export class QueryUserAssociationDto extends QueryDto {
	@UUIDFieldOptional()
	userId: string;

	@UUIDFieldOptional()
	groupId: string;

	@EnumFieldOptional(() => SortOrder)
	createdAtSortOrder: SortOrder;
}
