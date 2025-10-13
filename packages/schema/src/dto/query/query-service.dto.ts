import { Prisma } from "@prisma/client";
import { EnumFieldOptional } from "../../decorator/field";
import { QueryDto } from "./query.dto";

export class QueryServiceDto extends QueryDto {
	@EnumFieldOptional(() => Prisma.SortOrder, { default: Prisma.SortOrder })
	nameSortOrder?: Prisma.SortOrder;
}
