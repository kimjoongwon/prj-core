import {
	DateField,
	EnumField,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { type AuthAuditLog, AuthAuditResult } from "@cocrepo/prisma";

export class AuthAuditLogDto implements AuthAuditLog {
	@UUIDField({ description: "ID" })
	id!: string;

	@DateField({ description: "생성일" })
	createdAt!: Date;

	@StringField({ description: "이메일" })
	email!: string;

	@UUIDFieldOptional({ nullable: true, description: "사용자 ID" })
	userId!: string | null;

	@EnumField(() => AuthAuditResult, { description: "결과" })
	result!: AuthAuditResult;

	@StringFieldOptional({ nullable: true, description: "실패 사유" })
	failureReason!: string | null;

	@StringField({ description: "IP 주소" })
	ipAddress!: string;

	@StringFieldOptional({ nullable: true, description: "User Agent" })
	userAgent!: string | null;

	@StringFieldOptional({ nullable: true, description: "클라이언트 ID" })
	clientId!: string | null;
}
