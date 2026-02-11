import { StringFieldOptional } from "@cocrepo/decorator";
import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QuerySessionDto extends PrismaQueryDto<Prisma.SessionWhereInput> {
	@StringFieldOptional({ nullable: true, default: null })
	timelineId?: string | null;
}
