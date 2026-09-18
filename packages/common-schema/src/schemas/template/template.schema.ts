import { TemplateType } from "@cocrepo/enum";
import {
	BooleanValidation,
	EnumValidation,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Template의 DB 필드 타입과 공통 검증입니다. */
export class TemplateSchema extends AbstractSchema {
	templateId!: string;

	@StringValidation({ description: "고유 코드" })
	code!: string;

	@StringValidation({ description: "템플릿 이름" })
	name!: string;

	@EnumValidation(() => TemplateType, { description: "템플릿 유형" })
	type!: TemplateType;

	@StringValidationOptional({ nullable: true, description: "제목" })
	subject!: string | null;

	@StringValidation({ description: "본문" })
	content!: string;

	@StringValidationOptional({ nullable: true, description: "설명" })
	description!: string | null;

	@BooleanValidation({ description: "활성 상태" })
	isActive!: boolean;
}
