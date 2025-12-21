import { Prisma } from "@prisma/client";
import { EnumFieldOptional, UUIDFieldOptional } from "@cocrepo/decorator";
import { QueryDto } from "./query.dto";

export class QueryFileAssociationDto extends QueryDto {
	@UUIDFieldOptional()
	userId: string;

	@UUIDFieldOptional()
	fileId: string;

	@EnumFieldOptional(() => Prisma.SortOrder)
	createdAtSortOrder: Prisma.SortOrder;
}
