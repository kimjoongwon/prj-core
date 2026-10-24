import {
	BigIntIdValidation,
	DateValidation,
} from "../../decorators/model-validation";
import { PickSchemaType } from "../../utils/mapped-schema";
import { AbstractSchema } from "../abstract.schema";

/** PasswordHistory의 DB 필드 타입과 공통 검증입니다. */
export class PasswordHistorySchema
	extends PickSchemaType(AbstractSchema, ["seq", "createdAt"] as const)
{
	id!: string;

	@BigIntIdValidation({ description: "ID" })
	declare seq: bigint;

	@DateValidation({ description: "생성일" })
	declare createdAt: Date;

	@BigIntIdValidation({ description: "사용자 ID" })
	userSeq!: bigint;

	passwordHash!: string;
}
