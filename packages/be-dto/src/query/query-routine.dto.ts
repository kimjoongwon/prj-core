import { EnumFieldOptional, StringFieldOptional } from "@cocrepo/decorator";
import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";
import { SpaceScope } from "./query-exercise.dto";

export class QueryRoutineDto extends PrismaQueryDto<Prisma.RoutineWhereInput> {}

export class GetRoutinesQueryDto extends PrismaQueryDto<Prisma.RoutineWhereInput> {
	@StringFieldOptional()
	search?: string;

	@EnumFieldOptional(() => SpaceScope)
	spaceScope?: SpaceScope = SpaceScope.CURRENT;
}
