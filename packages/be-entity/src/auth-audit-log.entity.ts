import { AuthAuditResult } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";

/**
 * 인증 감사 로그 엔티티
 */
export class AuthAuditLog extends AbstractEntity {
	/** 공개 식별자 ULID */
	authAuditLogId!: string;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	email!: string;
	result!: AuthAuditResult;
	ipAddress!: string;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	userId!: bigint | null;
	failureReason!: string | null;
	userAgent!: string | null;
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
