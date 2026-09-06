import {
	BigIntIdFieldMetadata,
	BigIntIdFieldOptionalMetadata,
	DateFieldMetadata,
	EnumFieldMetadata,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { AuthAuditResult } from "@cocrepo/enum";
import { AuthAuditLogSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";

/**
 * 인증 감사 로그 엔티티
 */
@AbstractEntityFields()
export class AuthAuditLog extends AuthAuditLogSchema {
	@BigIntIdFieldMetadata({ description: "ID" })
	declare id: bigint;
	@DateFieldMetadata({ description: "생성일" })
	declare createdAt: Date;

	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare authAuditLogId: AuthAuditLogSchema["authAuditLogId"];

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@StringFieldMetadata({ description: "이메일" })
	declare email: AuthAuditLogSchema["email"];
	@EnumFieldMetadata(() => AuthAuditResult, { description: "결과" })
	declare result: AuthAuditLogSchema["result"];
	@StringFieldMetadata({ description: "IP 주소" })
	declare ipAddress: AuthAuditLogSchema["ipAddress"];

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@BigIntIdFieldOptionalMetadata({ nullable: true, description: "사용자 ID" })
	declare userId: AuthAuditLogSchema["userId"];
	@StringFieldOptionalMetadata({ nullable: true, description: "실패 사유" })
	declare failureReason: AuthAuditLogSchema["failureReason"];
	@StringFieldOptionalMetadata({ nullable: true, description: "User Agent" })
	declare userAgent: AuthAuditLogSchema["userAgent"];
	@StringFieldOptionalMetadata({ nullable: true, description: "클라이언트 ID" })
	declare clientId: AuthAuditLogSchema["clientId"];

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
