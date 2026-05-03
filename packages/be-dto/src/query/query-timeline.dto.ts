import { EnumFieldOptional, StringFieldOptional } from "@cocrepo/decorator";
import { LanguageCode, type Prisma } from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryTimelineDto extends PrismaQueryDto<Prisma.TimelineWhereInput> {
	@StringFieldOptional({ nullable: true, default: null })
	@Transform(({ value }) => (value === "null" ? null : value))
	timelineId?: string | null;

	@StringFieldOptional({ nullable: true, default: null })
	@Transform(({ value }) => (value === "null" ? null : value))
	search?: string | null;

	@EnumFieldOptional(() => LanguageCode)
	contentLanguageCode?: LanguageCode;
}
