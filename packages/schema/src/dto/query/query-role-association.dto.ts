import { Prisma } from "@prisma/client";
import { EnumFieldOptional, UUIDFieldOptional } from "../../decorator/field";
import { QueryDto } from "./query.dto";

export class QueryRoleAssociationDto extends QueryDto {
	@UUIDFieldOptional()
	roleId: string;

	@UUIDFieldOptional()
	groupId: string;

	@EnumFieldOptional(() => Prisma.SortOrder)
	createdAtSortOrder: Prisma.SortOrder;
}
