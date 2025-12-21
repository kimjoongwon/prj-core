import { EnumFieldOptional, UUIDFieldOptional } from "@cocrepo/decorator";
import { SortOrder } from "@cocrepo/enum";
import { QueryDto } from "./query.dto";

export class QueryRoleAssociationDto extends QueryDto {
	@UUIDFieldOptional()
	roleId: string;

	@UUIDFieldOptional()
	groupId: string;

	@EnumFieldOptional(() => SortOrder)
	createdAtSortOrder: SortOrder;
}
