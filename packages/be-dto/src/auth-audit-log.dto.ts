import {
	BigIntIdField,
	BigIntIdFieldOptional,
	DateField,
	EnumField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import { type AuthAuditLog, AuthAuditResult } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";

export class AuthAuditLogDto
	implements DomainEntityModel<AuthAuditLog, "authAuditLogId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly authAuditLogId?: never;

	@BigIntIdField({ description: "ID" })
	id!: bigint;

	@DateField({ description: "생성일" })
	createdAt!: Date;

	@StringField({ description: "이메일" })
	email!: string;

	@BigIntIdFieldOptional({ nullable: true, description: "사용자 ID" })
	userId!: bigint | null;

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
