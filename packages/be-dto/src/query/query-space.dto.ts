import { EnumFieldOptional, StringFieldOptional } from "@cocrepo/decorator";
import { LanguageCode } from "@cocrepo/prisma";
import { QueryDto } from "./query.dto";

export class QuerySpaceDto extends QueryDto {
	@StringFieldOptional()
	search?: string;

	@EnumFieldOptional(() => LanguageCode)
	contentLanguageCode?: LanguageCode;
}
