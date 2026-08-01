import type {
	AuthAuditLog as AuthAuditLogEntity,
	AuthAuditResult,
} from "@cocrepo/prisma";
import type { DomainEntityModel } from "./domain-entity-model.type";

export class AuthAuditLog implements DomainEntityModel<AuthAuditLogEntity> {
	// ============================================================================
	// 기본 필드
	// ============================================================================
	id!: string;
	createdAt!: Date;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	email!: string;
	result!: AuthAuditResult;
	ipAddress!: string;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	userId!: string | null;
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
