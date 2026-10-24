import {
	EnumFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { FitnessCenter } from "@cocrepo/entity";
import { LanguageCode } from "@cocrepo/prisma";
import { PartialType, PickType } from "@nestjs/swagger";

export class UpdateFitnessCenterDto extends PartialType(
	PickType(FitnessCenter, [
		"address",
		"phone",
		"email",
		"imageFileId",
	] as const),
	{ skipNullProperties: false },
) {
	// 이름/라벨은 Space가 소유하므로 FitnessCenter가 아닌 요청 선언에서 직접 정의합니다.
	@StringFieldOptional({ nullable: true })
	name?: string;

	@StringFieldOptional({ nullable: true })
	label?: string | null;

	@EnumFieldOptional(() => LanguageCode)
	contentLanguageCode?: LanguageCode;
}
