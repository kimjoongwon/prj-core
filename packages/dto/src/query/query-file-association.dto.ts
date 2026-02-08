import { UUIDFieldOptional } from "@cocrepo/decorator";
import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryFileAssociationDto extends PrismaQueryDto<Prisma.FileAssociationWhereInput> {
	@UUIDFieldOptional()
	userId?: string;

	@UUIDFieldOptional()
	fileId?: string;
}
