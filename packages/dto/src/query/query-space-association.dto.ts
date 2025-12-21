import { EnumFieldOptional, UUIDFieldOptional } from "@cocrepo/decorator";
import { SortOrder } from "@cocrepo/enum";
import { QueryDto } from "./query.dto";

export class QuerySpaceAssociationDto extends QueryDto {
	@UUIDFieldOptional()
	spaceId: string;

	@UUIDFieldOptional()
	groupId: string;

	@EnumFieldOptional(() => SortOrder)
	createdAtSortOrder: SortOrder;
}
