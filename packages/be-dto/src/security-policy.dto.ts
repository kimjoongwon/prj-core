import {
	BooleanField,
	DateField,
	DateFieldOptional,
	NumberField,
	StringField,
	ULIDField,
} from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { SecurityPolicy } from "@cocrepo/prisma";

/**
 * 보안 정책 응답 DTO
 */
export class SecurityPolicyDto implements DomainEntityModel<SecurityPolicy> {
	@ULIDField({ description: "ID" })
	id!: string;

	@DateField({ description: "생성일" })
	createdAt!: Date;

	@DateFieldOptional({ nullable: true, description: "수정일" })
	updatedAt!: Date | null;

	@StringField({ description: "정책 키" })
	key!: string;

	// 비밀번호 정책
	@NumberField({ description: "최소 비밀번호 길이", min: 4, max: 128 })
	passwordMinLength!: number;

	@BooleanField({ description: "대문자 필수" })
	passwordRequireUppercase!: boolean;

	@BooleanField({ description: "소문자 필수" })
	passwordRequireLowercase!: boolean;

	@BooleanField({ description: "숫자 필수" })
	passwordRequireNumber!: boolean;

	@BooleanField({ description: "특수문자 필수" })
	passwordRequireSpecial!: boolean;

	@NumberField({ description: "비밀번호 만료 일수 (0=무제한)", min: 0 })
	passwordExpirationDays!: number;

	@NumberField({ description: "비밀번호 재사용 제한 횟수", min: 0 })
	passwordReuseLimit!: number;

	// 잠금 정책
	@NumberField({ description: "일시 잠금 임계값", min: 1 })
	temporaryLockThreshold!: number;

	@NumberField({ description: "일시 잠금 시간 (분)", min: 1 })
	temporaryLockDurationMin!: number;

	@NumberField({ description: "영구 잠금 임계값", min: 1 })
	permanentLockThreshold!: number;

	// 세션 정책
	@NumberField({ description: "Access Token TTL (초)", min: 60 })
	accessTokenTtlSec!: number;

	@NumberField({ description: "Refresh Token TTL (초)", min: 60 })
	refreshTokenTtlSec!: number;

	@NumberField({ description: "세션 TTL (초)", min: 60 })
	sessionTtlSec!: number;

	// 화이트리스트 정책
	@BooleanField({ description: "IP 화이트리스트 활성화" })
	ipWhitelistEnabled!: boolean;

	@BooleanField({ description: "이메일 도메인 화이트리스트 활성화" })
	emailDomainWhitelistEnabled!: boolean;

	@BooleanField({ description: "CORS Origin 화이트리스트 활성화" })
	corsOriginWhitelistEnabled!: boolean;
}
