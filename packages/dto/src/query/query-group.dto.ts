import { StringFieldOptional } from "@cocrepo/decorator";
import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryGroupDto extends PrismaQueryDto<Prisma.GroupWhereInput> {
	@StringFieldOptional()
	name?: string;

	@StringFieldOptional()
	serviceId?: string;
}
