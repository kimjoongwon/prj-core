import { Prisma } from "@prisma/client";
import { EnumFieldOptional } from "../../decorator/field";
import { QueryDto } from "./query.dto";

export class QueryTenantDto extends QueryDto {
	@EnumFieldOptional(() => Prisma.SortOrder)
	createdAtSortOrder?: Prisma.SortOrder;
}
