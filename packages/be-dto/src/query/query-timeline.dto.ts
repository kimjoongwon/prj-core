import {
	BigIntIdFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { LanguageCode } from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { QueryDto } from "./query.dto";

export class QueryTimelineDto extends QueryDto {
	@BigIntIdFieldOptional({ nullable: true, default: null })
	@Transform(({ value }) => (value === "null" ? null : value))
	timelineId?: bigint | null;

	@StringFieldOptional({ nullable: true, default: null })
	@Transform(({ value }) => (value === "null" ? null : value))
	search?: string | null;

	@EnumFieldOptional(() => LanguageCode)
	contentLanguageCode?: LanguageCode;
}
