import type { PasswordHistory as PrismaPasswordHistory } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	DateValidation,
} from "../../decorators/model-validation";
import { PickSchemaType } from "../../utils/mapped-schema";
import { AbstractSchema } from "../abstract.schema";

/** PasswordHistory의 DB 필드 타입과 공통 검증입니다. */
export class PasswordHistorySchema
	extends PickSchemaType(AbstractSchema, ["id", "createdAt"] as const)
	implements PrismaPasswordHistory
{
	passwordHistoryId!: PrismaPasswordHistory["passwordHistoryId"];

	@BigIntIdValidation({ description: "ID" })
	declare id: PrismaPasswordHistory["id"];

	@DateValidation({ description: "생성일" })
	declare createdAt: PrismaPasswordHistory["createdAt"];

	@BigIntIdValidation({ description: "사용자 ID" })
	userId!: PrismaPasswordHistory["userId"];

	passwordHash!: PrismaPasswordHistory["passwordHash"];
}
