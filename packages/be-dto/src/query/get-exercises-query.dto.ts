import {
	EnumFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { LanguageCode } from "@cocrepo/prisma";
import { QueryDto } from "./query.dto";

import { SpaceScope } from "./space-scope";

export class GetExercisesQueryDto extends QueryDto {
	@StringFieldOptional()
	search?: string;

	@EnumFieldOptional(() => SpaceScope)
	spaceScope?: SpaceScope = SpaceScope.CURRENT;

	@EnumFieldOptional(() => LanguageCode)
	contentLanguageCode?: LanguageCode;
}
