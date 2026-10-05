import { LanguageCode } from "@cocrepo/enum";
import { EnumValidation } from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Space의 DB 필드 타입과 공통 검증입니다. */
export class SpaceSchema extends AbstractSchema {
	spaceId!: string;

	@EnumValidation(() => LanguageCode, {
		description: "이 Space에서 작성되는 운영 리소스의 콘텐츠 언어",
	})
	contentLanguageCode!: LanguageCode;
}
