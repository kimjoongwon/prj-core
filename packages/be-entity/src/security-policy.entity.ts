import { AbstractEntity } from "./abstract.entity";

/**
 * 보안 정책 엔티티
 *
 * 시스템 전역 보안 정책을 나타냅니다. (싱글턴)
 * 비밀번호, 잠금, 세션 정책을 포함합니다.
 */
export class SecurityPolicy extends AbstractEntity {
	/** 공개 식별자 ULID */
	securityPolicyId!: string;

	// ============================================================================
	// 기본 필드
	// ============================================================================
	key!: string;

	// ============================================================================
	// 비밀번호 정책
	// ============================================================================
	passwordMinLength!: number;
	passwordRequireUppercase!: boolean;
	passwordRequireLowercase!: boolean;
	passwordRequireNumber!: boolean;
	passwordRequireSpecial!: boolean;
	passwordExpirationDays!: number;
	passwordReuseLimit!: number;

	// ============================================================================
	// 잠금 정책
	// ============================================================================
	temporaryLockThreshold!: number;
	temporaryLockDurationMin!: number;
	permanentLockThreshold!: number;

	// ============================================================================
	// 세션 정책
	// ============================================================================
	accessTokenTtlSec!: number;
	refreshTokenTtlSec!: number;
	sessionTtlSec!: number;

	// ============================================================================
	// 화이트리스트 정책
	// ============================================================================
	ipWhitelistEnabled!: boolean;
	emailDomainWhitelistEnabled!: boolean;
	corsOriginWhitelistEnabled!: boolean;

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	/**
	 * 일시 잠금 시간을 밀리초로 반환합니다
	 */
	getTemporaryLockDurationMs(): number {
		return this.temporaryLockDurationMin * 60 * 1000;
	}

	/**
	 * 비밀번호 만료가 활성화되어 있는지 확인합니다
	 */
	isPasswordExpirationEnabled(): boolean {
		return this.passwordExpirationDays > 0;
	}
}
