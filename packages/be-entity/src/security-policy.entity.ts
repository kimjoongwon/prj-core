import {
	BigIntIdField,
	BooleanField,
	DateField,
	DateFieldOptional,
	NumberField,
	StringField,
} from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";

/**
 * 보안 정책 엔티티
 *
 * 시스템 전역 보안 정책을 나타냅니다. (싱글턴)
 * 비밀번호, 잠금, 세션 정책을 포함합니다.
 */
export class SecurityPolicy extends AbstractEntity {
	@BigIntIdField({ description: "ID" })
	declare id: bigint;
	@DateField({ description: "생성일" })
	declare createdAt: Date;
	@DateFieldOptional({ nullable: true, description: "수정일" })
	declare updatedAt: Date | null;

	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	securityPolicyId!: string;

	// ============================================================================
	// 기본 필드
	// ============================================================================
	@StringField({ description: "정책 키" })
	key!: string;

	// ============================================================================
	// 비밀번호 정책
	// ============================================================================
	@NumberField({ description: "최소 비밀번호 길이", min: 4, max: 128 })
	passwordMinLength!: number;
	@BooleanField({ description: "대문자 필수" })
	passwordRequireUppercase!: boolean;
	@BooleanField({ description: "소문자 필수" })
	passwordRequireLowercase!: boolean;
	@BooleanField({ description: "숫자 필수" }) passwordRequireNumber!: boolean;
	@BooleanField({ description: "특수문자 필수" })
	passwordRequireSpecial!: boolean;
	@NumberField({ description: "비밀번호 만료 일수 (0=무제한)", min: 0 })
	passwordExpirationDays!: number;
	@NumberField({ description: "비밀번호 재사용 제한 횟수", min: 0 })
	passwordReuseLimit!: number;

	// ============================================================================
	// 잠금 정책
	// ============================================================================
	@NumberField({ description: "일시 잠금 임계값", min: 1 })
	temporaryLockThreshold!: number;
	@NumberField({ description: "일시 잠금 시간 (분)", min: 1 })
	temporaryLockDurationMin!: number;
	@NumberField({ description: "영구 잠금 임계값", min: 1 })
	permanentLockThreshold!: number;

	// ============================================================================
	// 세션 정책
	// ============================================================================
	@NumberField({ description: "Access Token TTL (초)", min: 60 })
	accessTokenTtlSec!: number;
	@NumberField({ description: "Refresh Token TTL (초)", min: 60 })
	refreshTokenTtlSec!: number;
	@NumberField({ description: "세션 TTL (초)", min: 60 })
	sessionTtlSec!: number;

	// ============================================================================
	// 화이트리스트 정책
	// ============================================================================
	@BooleanField({ description: "IP 화이트리스트 활성화" })
	ipWhitelistEnabled!: boolean;
	@BooleanField({ description: "이메일 도메인 화이트리스트 활성화" })
	emailDomainWhitelistEnabled!: boolean;
	@BooleanField({ description: "CORS Origin 화이트리스트 활성화" })
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
