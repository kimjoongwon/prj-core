import { LanguageCode } from "@cocrepo/enum";
import {
	BooleanValidation,
	EnumValidation,
	StringValidation,
} from "../../decorators/model-validation";
import { PickSchemaType } from "../../utils/mapped-schema";
import { AbstractSchema } from "../abstract.schema";

/** Translation의 DB 필드 타입과 공통 검증입니다. */
export class TranslationSchema
	extends PickSchemaType(AbstractSchema, [
		"id",
		"createdAt",
		"updatedAt",
	] as const)
{
	translationId!: string;

	declare id: bigint;

	@EnumValidation(() => LanguageCode)
	languageCode!: LanguageCode;

	@StringValidation()
	key!: string;

	@StringValidation()
	text!: string;

	@StringValidation()
	category!: string;

	@BooleanValidation()
	isTranslated!: boolean;

	declare createdAt: Date;

	declare updatedAt: Date | null;
}
