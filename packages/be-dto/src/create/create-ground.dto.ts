import { EnumField } from "@cocrepo/decorator";
import { LanguageCode } from "@cocrepo/prisma";
import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { GroundDto } from "../ground.dto";

export class CreateGroundDto extends OmitType(GroundDto, [
	...COMMON_ENTITY_FIELDS,
	"company",
	"companyId",
	"space",
	"spaceId",
]) {
	@EnumField(() => LanguageCode, {
		description: "이 Space에서 작성되는 운영 리소스의 콘텐츠 언어",
		default: LanguageCode.ko_KR,
	})
	contentLanguageCode: LanguageCode;
}
