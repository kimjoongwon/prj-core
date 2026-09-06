import {
	BigIntIdField,
	BigIntIdFieldOptional,
	DateField,
	EnumField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { AuthAuditResult } from "@cocrepo/enum";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";

/**
 * 인증 감사 로그 엔티티
 */
export class AuthAuditLog extends AbstractEntity {
	@BigIntIdField({ description: "ID" })
	declare id: bigint;
	@DateField({ description: "생성일" })
	declare createdAt: Date;

	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	authAuditLogId!: string;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@StringField({ description: "이메일" })
	email!: string;
	@EnumField(() => AuthAuditResult, { description: "결과" })
	result!: AuthAuditResult;
	@StringField({ description: "IP 주소" })
	ipAddress!: string;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@BigIntIdFieldOptional({ nullable: true, description: "사용자 ID" })
	userId!: bigint | null;
	@StringFieldOptional({ nullable: true, description: "실패 사유" })
	failureReason!: string | null;
	@StringFieldOptional({ nullable: true, description: "User Agent" })
	userAgent!: string | null;
	@StringFieldOptional({ nullable: true, description: "클라이언트 ID" })
	clientId!: string | null;

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	/**
	 * 로그인 성공 여부를 확인합니다
	 */
	isSuccess(): boolean {
		return this.result === "SUCCESS";
	}

	/**
	 * 계정 잠금으로 인한 실패인지 확인합니다
	 */
	isLockedOut(): boolean {
		return this.result === "LOCKED";
	}
}
