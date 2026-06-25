import { EnumFieldOptional, StringFieldOptional } from "@cocrepo/decorator";
import { LanguageCode } from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { QueryDto } from "./query.dto";

export class QueryTimelineDto extends QueryDto {
	@StringFieldOptional({ nullable: true, default: null })
	@Transform(({ value }) => (value === "null" ? null : value))
	timelineId?: string | null;

	@StringFieldOptional({ nullable: true, default: null })
	@Transform(({ value }) => (value === "null" ? null : value))
	search?: string | null;

	@EnumFieldOptional(() => LanguageCode)
	contentLanguageCode?: LanguageCode;
}
