import { LanguageCode } from "@cocrepo/enum";
import { EnumValidation, StringValidation, StringValidationOptional } from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Space의 DB 필드 타입과 공통 검증입니다. */
export class SpaceSchema extends AbstractSchema {
	id!: string;

	@StringValidation({
		description: "Space의 표시 이름. 공간 선택·목록·검색의 원천입니다.",
	})
	name!: string;

	@StringValidationOptional({
		description: "Space 표시 이름 아래에 함께 보여주는 보조 라벨입니다.",
		nullable: true,
	})
	label!: string | null;

	@EnumValidation(() => LanguageCode, {
		description: "이 Space에서 작성되는 운영 리소스의 콘텐츠 언어",
	})
	contentLanguageCode!: LanguageCode;
}
