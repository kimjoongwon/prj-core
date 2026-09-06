import type { TemplateVariable as PrismaTemplateVariable } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	BooleanValidation,
	DateValidation,
	DateValidationOptional,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { PickSchemaType } from "../../utils/mapped-schema";
import { AbstractSchema } from "../abstract.schema";

/** TemplateVariable의 DB 필드 타입과 공통 검증입니다. */
export class TemplateVariableSchema
	extends PickSchemaType(AbstractSchema, [
		"id",
		"createdAt",
		"updatedAt",
	] as const)
	implements PrismaTemplateVariable
{
	templateVariableId!: PrismaTemplateVariable["templateVariableId"];

	@BigIntIdValidation({ description: "ID" })
	declare id: PrismaTemplateVariable["id"];

	@DateValidation({ description: "생성일" })
	declare createdAt: PrismaTemplateVariable["createdAt"];

	@DateValidationOptional({ nullable: true, description: "수정일" })
	declare updatedAt: PrismaTemplateVariable["updatedAt"];

	@StringValidation({ description: "변수명" })
	name!: PrismaTemplateVariable["name"];

	@StringValidationOptional({ nullable: true, description: "변수 설명" })
	description!: PrismaTemplateVariable["description"];

	@StringValidationOptional({ nullable: true, description: "기본값" })
	defaultValue!: PrismaTemplateVariable["defaultValue"];

	@BooleanValidation({ description: "필수 여부" })
	isRequired!: PrismaTemplateVariable["isRequired"];

	@BigIntIdValidation({ description: "템플릿 ID" })
	templateId!: PrismaTemplateVariable["templateId"];
}
