import { EnumFieldOptional, StringFieldOptional } from "@cocrepo/decorator";
import type { Prisma } from "@cocrepo/prisma";
import { LanguageCode } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QuerySpaceDto extends PrismaQueryDto<Prisma.SpaceWhereInput> {
	@StringFieldOptional()
	search?: string;

	@EnumFieldOptional(() => LanguageCode)
	contentLanguageCode?: LanguageCode;
}
