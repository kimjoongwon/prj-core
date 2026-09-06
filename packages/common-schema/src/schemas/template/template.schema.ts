import { TemplateType } from "@cocrepo/enum";
import type { Template as PrismaTemplate } from "@cocrepo/prisma";
import {
	BooleanValidation,
	EnumValidation,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Template의 DB 필드 타입과 공통 검증입니다. */
export class TemplateSchema extends AbstractSchema implements PrismaTemplate {
	templateId!: PrismaTemplate["templateId"];

	@StringValidation({ description: "고유 코드" })
	code!: PrismaTemplate["code"];

	@StringValidation({ description: "템플릿 이름" })
	name!: PrismaTemplate["name"];

	@EnumValidation(() => TemplateType, { description: "템플릿 유형" })
	type!: PrismaTemplate["type"];

	@StringValidationOptional({ nullable: true, description: "제목" })
	subject!: PrismaTemplate["subject"];

	@StringValidation({ description: "본문" })
	content!: PrismaTemplate["content"];

	@StringValidationOptional({ nullable: true, description: "설명" })
	description!: PrismaTemplate["description"];

	@BooleanValidation({ description: "활성 상태" })
	isActive!: PrismaTemplate["isActive"];
}
