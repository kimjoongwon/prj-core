import { EnumFieldOptional, StringFieldOptional } from "@cocrepo/decorator";
import { LanguageCode, type Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export enum SpaceScope {
	CURRENT = "CURRENT",
	INCLUDE_ANCESTORS = "INCLUDE_ANCESTORS",
}

export class GetExercisesQueryDto extends PrismaQueryDto<Prisma.ExerciseWhereInput> {
	@StringFieldOptional()
	search?: string;

	@EnumFieldOptional(() => SpaceScope)
	spaceScope?: SpaceScope = SpaceScope.CURRENT;

	@EnumFieldOptional(() => LanguageCode)
	contentLanguageCode?: LanguageCode;
}
