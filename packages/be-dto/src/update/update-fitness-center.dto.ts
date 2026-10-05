import { EnumFieldOptional } from "@cocrepo/decorator/field";
import { FitnessCenter } from "@cocrepo/entity";
import { LanguageCode } from "@cocrepo/prisma";
import { PartialType, PickType } from "@nestjs/swagger";

export class UpdateFitnessCenterDto extends PartialType(
	PickType(FitnessCenter, [
		"name",
		"label",
		"address",
		"phone",
		"email",
		"imageFileId",
	] as const),
	{ skipNullProperties: false },
) {
	@EnumFieldOptional(() => LanguageCode)
	contentLanguageCode?: LanguageCode;
}
