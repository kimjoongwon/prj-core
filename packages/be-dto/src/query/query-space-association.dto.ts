import { UUIDFieldOptional } from "@cocrepo/decorator";
import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QuerySpaceAssociationDto extends PrismaQueryDto<Prisma.SpaceAssociationWhereInput> {
	@UUIDFieldOptional()
	spaceId?: string;

	@UUIDFieldOptional()
	groupId?: string;
}
