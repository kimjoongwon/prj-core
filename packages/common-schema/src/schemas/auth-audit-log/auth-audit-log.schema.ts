import { AuthAuditResult } from "@cocrepo/enum";
import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	DateValidation,
	EnumValidation,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { PickSchemaType } from "../../utils/mapped-schema";
import { AbstractSchema } from "../abstract.schema";

/** AuthAuditLog의 DB 필드 타입과 공통 검증입니다. */
export class AuthAuditLogSchema
	extends PickSchemaType(AbstractSchema, ["id", "createdAt"] as const)
{
	authAuditLogId!: string;

	@BigIntIdValidation({ description: "ID" })
	declare id: bigint;

	@DateValidation({ description: "생성일" })
	declare createdAt: Date;

	@StringValidation({ description: "이메일" })
	email!: string;

	@BigIntIdValidationOptional({ nullable: true, description: "사용자 ID" })
	userId!: bigint | null;

	@EnumValidation(() => AuthAuditResult, { description: "결과" })
	result!: AuthAuditResult;

	@StringValidationOptional({ nullable: true, description: "실패 사유" })
	failureReason!: string | null;

	@StringValidation({ description: "IP 주소" })
	ipAddress!: string;

	@StringValidationOptional({ nullable: true, description: "User Agent" })
	userAgent!: string | null;

	@StringValidationOptional({ nullable: true, description: "클라이언트 ID" })
	clientId!: string | null;
}
