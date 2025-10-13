import { Prisma } from "@prisma/client";
import { EnumFieldOptional, UUIDFieldOptional } from "../../decorator/field";
import { QueryDto } from "./query.dto";

export class QueryFileAssociationDto extends QueryDto {
	@UUIDFieldOptional()
	userId: string;

	@UUIDFieldOptional()
	fileId: string;

	@EnumFieldOptional(() => Prisma.SortOrder)
	createdAtSortOrder: Prisma.SortOrder;
}
