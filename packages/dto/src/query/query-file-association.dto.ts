import { EnumFieldOptional, UUIDFieldOptional } from "@cocrepo/decorator";
import { SortOrder } from "@cocrepo/enum";
import { QueryDto } from "./query.dto";

export class QueryFileAssociationDto extends QueryDto {
	@UUIDFieldOptional()
	userId: string;

	@UUIDFieldOptional()
	fileId: string;

	@EnumFieldOptional(() => SortOrder)
	createdAtSortOrder: SortOrder;
}
