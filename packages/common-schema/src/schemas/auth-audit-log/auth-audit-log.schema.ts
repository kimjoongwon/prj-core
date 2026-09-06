import { AuthAuditResult } from "@cocrepo/enum";
import type { AuthAuditLog as PrismaAuthAuditLog } from "@cocrepo/prisma";
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
	implements PrismaAuthAuditLog
{
	authAuditLogId!: PrismaAuthAuditLog["authAuditLogId"];

	@BigIntIdValidation({ description: "ID" })
	declare id: PrismaAuthAuditLog["id"];

	@DateValidation({ description: "생성일" })
	declare createdAt: PrismaAuthAuditLog["createdAt"];

	@StringValidation({ description: "이메일" })
	email!: PrismaAuthAuditLog["email"];

	@BigIntIdValidationOptional({ nullable: true, description: "사용자 ID" })
	userId!: PrismaAuthAuditLog["userId"];

	@EnumValidation(() => AuthAuditResult, { description: "결과" })
	result!: PrismaAuthAuditLog["result"];

	@StringValidationOptional({ nullable: true, description: "실패 사유" })
	failureReason!: PrismaAuthAuditLog["failureReason"];

	@StringValidation({ description: "IP 주소" })
	ipAddress!: PrismaAuthAuditLog["ipAddress"];

	@StringValidationOptional({ nullable: true, description: "User Agent" })
	userAgent!: PrismaAuthAuditLog["userAgent"];

	@StringValidationOptional({ nullable: true, description: "클라이언트 ID" })
	clientId!: PrismaAuthAuditLog["clientId"];
}
