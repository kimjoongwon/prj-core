import { LanguageCode } from "@cocrepo/enum";
import type { Translation as PrismaTranslation } from "@cocrepo/prisma";
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
	implements PrismaTranslation
{
	translationId!: PrismaTranslation["translationId"];

	declare id: PrismaTranslation["id"];

	@EnumValidation(() => LanguageCode)
	languageCode!: PrismaTranslation["languageCode"];

	@StringValidation()
	key!: PrismaTranslation["key"];

	@StringValidation()
	text!: PrismaTranslation["text"];

	@StringValidation()
	category!: PrismaTranslation["category"];

	@BooleanValidation()
	isTranslated!: PrismaTranslation["isTranslated"];

	declare createdAt: PrismaTranslation["createdAt"];

	declare updatedAt: PrismaTranslation["updatedAt"];
}
