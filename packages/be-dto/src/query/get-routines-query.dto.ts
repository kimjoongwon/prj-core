import { EnumFieldOptional, StringFieldOptional } from "@cocrepo/decorator";
import { LanguageCode } from "@cocrepo/prisma";
import { QueryDto } from "./query.dto";
import { SpaceScope } from "./query-exercise.dto";

export class GetRoutinesQueryDto extends QueryDto {
	@StringFieldOptional()
	search?: string;

	@EnumFieldOptional(() => SpaceScope)
	spaceScope?: SpaceScope = SpaceScope.CURRENT;

	@EnumFieldOptional(() => LanguageCode)
	contentLanguageCode?: LanguageCode;
}
