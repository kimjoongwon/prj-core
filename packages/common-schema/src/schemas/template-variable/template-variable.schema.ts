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
{
	templateVariableId!: string;

	@BigIntIdValidation({ description: "ID" })
	declare id: bigint;

	@DateValidation({ description: "생성일" })
	declare createdAt: Date;

	@DateValidationOptional({ nullable: true, description: "수정일" })
	declare updatedAt: Date | null;

	@StringValidation({ description: "변수명" })
	name!: string;

	@StringValidationOptional({ nullable: true, description: "변수 설명" })
	description!: string | null;

	@StringValidationOptional({ nullable: true, description: "기본값" })
	defaultValue!: string | null;

	@BooleanValidation({ description: "필수 여부" })
	isRequired!: boolean;

	@BigIntIdValidation({ description: "템플릿 ID" })
	templateId!: bigint;
}
