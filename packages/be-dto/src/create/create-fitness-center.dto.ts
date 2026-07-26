import { EnumField, StringField, UUIDFieldOptional } from "@cocrepo/decorator";
import { LanguageCode } from "@cocrepo/prisma";
import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { FitnessCenterDto } from "../fitness-center.dto";

export class CreateFitnessCenterDto extends OmitType(FitnessCenterDto, [
	...COMMON_ENTITY_FIELDS,
	"company",
	"companyId",
	"spaceId",
]) {
	@EnumField(() => LanguageCode, {
		description: "이 Space에서 작성되는 운영 리소스의 콘텐츠 언어",
		default: LanguageCode.ko_KR,
	})
	contentLanguageCode: LanguageCode;

	@StringField()
	businessNo: string;

	@UUIDFieldOptional({ nullable: true })
	logoImageFileId: string | null;
}
