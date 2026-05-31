import { EnumFieldOptional, StringFieldOptional } from "@cocrepo/decorator";
import { LanguageCode, type Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

import { SpaceScope } from "./space-scope";

export class GetExercisesQueryDto extends PrismaQueryDto<Prisma.ExerciseWhereInput> {
	@StringFieldOptional()
	search?: string;

	@EnumFieldOptional(() => SpaceScope)
	spaceScope?: SpaceScope = SpaceScope.CURRENT;

	@EnumFieldOptional(() => LanguageCode)
	contentLanguageCode?: LanguageCode;
}
