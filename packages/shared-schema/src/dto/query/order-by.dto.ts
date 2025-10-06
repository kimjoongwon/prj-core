import { Prisma } from "@prisma/client";
import { EnumFieldOptional } from "../../decorator/field";

export class OrderByDto {
	@EnumFieldOptional(() => Prisma.SortOrder)
	idSortOrder?: Prisma.SortOrder;

	@EnumFieldOptional(() => Prisma.SortOrder)
	createdAtSortOrder?: Prisma.SortOrder;

	@EnumFieldOptional(() => Prisma.SortOrder)
	updatedAtSortOrder?: Prisma.SortOrder;

	@EnumFieldOptional(() => Prisma.SortOrder)
	removedAtSortOrder?: Prisma.SortOrder;
}
