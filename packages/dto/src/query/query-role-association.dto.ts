import { UUIDFieldOptional } from "@cocrepo/decorator";
import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryRoleAssociationDto extends PrismaQueryDto<Prisma.RoleAssociationWhereInput> {
	@UUIDFieldOptional()
	roleId?: string;

	@UUIDFieldOptional()
	groupId?: string;
}
