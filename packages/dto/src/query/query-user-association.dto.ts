import { UUIDFieldOptional } from "@cocrepo/decorator";
import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryUserAssociationDto extends PrismaQueryDto<Prisma.UserAssociationWhereInput> {
	@UUIDFieldOptional()
	userId?: string;

	@UUIDFieldOptional()
	groupId?: string;
}
