import {
	BigIntIdFieldMetadata,
	BooleanFieldMetadata,
	DateFieldMetadata,
	DateFieldOptionalMetadata,
	NumberFieldMetadata,
	StringFieldMetadata,
} from "@cocrepo/decorator/field";
import { SecurityPolicySchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";

/**
 * 보안 정책 엔티티
 *
 * 시스템 전역 보안 정책을 나타냅니다. (싱글턴)
 * 비밀번호, 잠금, 세션 정책을 포함합니다.
 */
@AbstractEntityFields()
export class SecurityPolicy extends SecurityPolicySchema {
	@BigIntIdFieldMetadata({ description: "ID" })
	declare id: bigint;
	@DateFieldMetadata({ description: "생성일" })
	declare createdAt: Date;
	@DateFieldOptionalMetadata({ nullable: true, description: "수정일" })
	declare updatedAt: Date | null;

	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare securityPolicyId: SecurityPolicySchema["securityPolicyId"];

	// ============================================================================
	// 기본 필드
	// ============================================================================
	@StringFieldMetadata({ description: "정책 키" })
	declare key: SecurityPolicySchema["key"];

	// ============================================================================
	// 비밀번호 정책
	// ============================================================================
	@NumberFieldMetadata({ description: "최소 비밀번호 길이", min: 4, max: 128 })
	declare passwordMinLength: SecurityPolicySchema["passwordMinLength"];
	@BooleanFieldMetadata({ description: "대문자 필수" })
	declare passwordRequireUppercase: SecurityPolicySchema["passwordRequireUppercase"];
	@BooleanFieldMetadata({ description: "소문자 필수" })
	declare passwordRequireLowercase: SecurityPolicySchema["passwordRequireLowercase"];
	@BooleanFieldMetadata({ description: "숫자 필수" })
	declare passwordRequireNumber: SecurityPolicySchema["passwordRequireNumber"];
	@BooleanFieldMetadata({ description: "특수문자 필수" })
	declare passwordRequireSpecial: SecurityPolicySchema["passwordRequireSpecial"];
	@NumberFieldMetadata({ description: "비밀번호 만료 일수 (0=무제한)", min: 0 })
	declare passwordExpirationDays: SecurityPolicySchema["passwordExpirationDays"];
	@NumberFieldMetadata({ description: "비밀번호 재사용 제한 횟수", min: 0 })
	declare passwordReuseLimit: SecurityPolicySchema["passwordReuseLimit"];

	// ============================================================================
	// 잠금 정책
	// ============================================================================
	@NumberFieldMetadata({ description: "일시 잠금 임계값", min: 1 })
	declare temporaryLockThreshold: SecurityPolicySchema["temporaryLockThreshold"];
	@NumberFieldMetadata({ description: "일시 잠금 시간 (분)", min: 1 })
	declare temporaryLockDurationMin: SecurityPolicySchema["temporaryLockDurationMin"];
	@NumberFieldMetadata({ description: "영구 잠금 임계값", min: 1 })
	declare permanentLockThreshold: SecurityPolicySchema["permanentLockThreshold"];

	// ============================================================================
	// 세션 정책
	// ============================================================================
	@NumberFieldMetadata({ description: "Access Token TTL (초)", min: 60 })
	declare accessTokenTtlSec: SecurityPolicySchema["accessTokenTtlSec"];
	@NumberFieldMetadata({ description: "Refresh Token TTL (초)", min: 60 })
	declare refreshTokenTtlSec: SecurityPolicySchema["refreshTokenTtlSec"];
	@NumberFieldMetadata({ description: "세션 TTL (초)", min: 60 })
	declare sessionTtlSec: SecurityPolicySchema["sessionTtlSec"];

	// ============================================================================
	// 화이트리스트 정책
	// ============================================================================
	@BooleanFieldMetadata({ description: "IP 화이트리스트 활성화" })
	declare ipWhitelistEnabled: SecurityPolicySchema["ipWhitelistEnabled"];
	@BooleanFieldMetadata({ description: "이메일 도메인 화이트리스트 활성화" })
	declare emailDomainWhitelistEnabled: SecurityPolicySchema["emailDomainWhitelistEnabled"];
	@BooleanFieldMetadata({ description: "CORS Origin 화이트리스트 활성화" })
	declare corsOriginWhitelistEnabled: SecurityPolicySchema["corsOriginWhitelistEnabled"];

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
