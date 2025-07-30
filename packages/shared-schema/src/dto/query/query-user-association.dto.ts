import { Prisma } from "@prisma/client";
import {
	EnumFieldOptional,
	UUIDFieldOptional,
} from "../../decorator/field.decorators";
import { QueryDto } from "./query.dto";

export class QueryUserAssociationDto extends QueryDto {
	@UUIDFieldOptional()
	userId: string;

	@UUIDFieldOptional()
	groupId: string;

	@EnumFieldOptional(() => Prisma.SortOrder)
	createdAtSortOrder: Prisma.SortOrder;
}
