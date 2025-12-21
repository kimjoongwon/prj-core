import { EnumFieldOptional } from "@cocrepo/decorator";
import { SortOrder } from "@cocrepo/enum";

export class OrderByDto {
	@EnumFieldOptional(() => SortOrder)
	idSortOrder?: SortOrder;

	@EnumFieldOptional(() => SortOrder)
	createdAtSortOrder?: SortOrder;

	@EnumFieldOptional(() => SortOrder)
	updatedAtSortOrder?: SortOrder;

	@EnumFieldOptional(() => SortOrder)
	removedAtSortOrder?: SortOrder;
}
