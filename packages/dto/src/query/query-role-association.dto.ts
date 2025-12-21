import { Prisma } from "@prisma/client";
import { EnumFieldOptional, UUIDFieldOptional } from "@cocrepo/decorator";
import { QueryDto } from "./query.dto";

export class QueryRoleAssociationDto extends QueryDto {
	@UUIDFieldOptional()
	roleId: string;

	@UUIDFieldOptional()
	groupId: string;

	@EnumFieldOptional(() => Prisma.SortOrder)
	createdAtSortOrder: Prisma.SortOrder;
}
