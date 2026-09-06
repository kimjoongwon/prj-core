import { WhitelistType } from "@cocrepo/enum";
import type { WhitelistEntry as PrismaWhitelistEntry } from "@cocrepo/prisma";
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
	implements PrismaWhitelistEntry
{
	whitelistEntryId!: PrismaWhitelistEntry["whitelistEntryId"];

	@BigIntIdValidation({ description: "ID" })
	declare id: PrismaWhitelistEntry["id"];

	@DateValidation({ description: "생성일" })
	declare createdAt: PrismaWhitelistEntry["createdAt"];

	@DateValidationOptional({ nullable: true, description: "수정일" })
	declare updatedAt: PrismaWhitelistEntry["updatedAt"];

	@EnumValidation(() => WhitelistType, { description: "유형" })
	type!: PrismaWhitelistEntry["type"];

	@StringValidation({ description: "값" })
	value!: PrismaWhitelistEntry["value"];

	@StringValidationOptional({ nullable: true, description: "설명" })
	description!: PrismaWhitelistEntry["description"];

	@BooleanValidation({ description: "활성 여부" })
	isActive!: PrismaWhitelistEntry["isActive"];
}
