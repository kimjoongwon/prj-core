import { WhitelistType } from "@cocrepo/enum";
import {
	BigIntIdValidation,
	BooleanValidation,
	DateValidation,
	DateValidationOptional,
	EnumValidation,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { PickSchemaType } from "../../utils/mapped-schema";
import { AbstractSchema } from "../abstract.schema";

/** WhitelistEntry의 DB 필드 타입과 공통 검증입니다. */
export class WhitelistEntrySchema
	extends PickSchemaType(AbstractSchema, [
		"id",
		"createdAt",
		"updatedAt",
	] as const)
{
	whitelistEntryId!: string;

	@BigIntIdValidation({ description: "ID" })
	declare id: bigint;

	@DateValidation({ description: "생성일" })
	declare createdAt: Date;

	@DateValidationOptional({ nullable: true, description: "수정일" })
	declare updatedAt: Date | null;

	@EnumValidation(() => WhitelistType, { description: "유형" })
	type!: WhitelistType;

	@StringValidation({ description: "값" })
	value!: string;

	@StringValidationOptional({ nullable: true, description: "설명" })
	description!: string | null;

	@BooleanValidation({ description: "활성 여부" })
	isActive!: boolean;
}
