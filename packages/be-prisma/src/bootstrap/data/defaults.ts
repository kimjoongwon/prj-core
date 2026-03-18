/**
 * bootstrap 시점의 기본 보안 정책입니다.
 *
 * 여기서는 단일 레코드만 관리하며, `key: "default"`를 고정 lookup key로 사용합니다.
 * 운영자가 이후 값을 조정할 수 있으므로 reference-data처럼 광범위한 upsert 대상과는 다릅니다.
 */

export interface SecurityPolicySeedData {
	key: string;
	passwordMinLength: number;
	passwordRequireUppercase: boolean;
	passwordRequireLowercase: boolean;
	passwordRequireNumber: boolean;
	passwordRequireSpecial: boolean;
	passwordExpirationDays: number;
	passwordReuseLimit: number;
	temporaryLockThreshold: number;
	temporaryLockDurationMin: number;
	permanentLockThreshold: number;
	accessTokenTtlSec: number;
	refreshTokenTtlSec: number;
	sessionTtlSec: number;
	ipWhitelistEnabled: boolean;
	emailDomainWhitelistEnabled: boolean;
	corsOriginWhitelistEnabled: boolean;
}

// create-or-ignore 성격의 bootstrap 기본값으로, 다른 레코드와 구분되는 고정 key를 사용합니다.
export const securityPolicySeedData: SecurityPolicySeedData = {
	key: "default",
	passwordMinLength: 8,
	passwordRequireUppercase: true,
	passwordRequireLowercase: true,
	passwordRequireNumber: true,
	passwordRequireSpecial: true,
	passwordExpirationDays: 0,
	passwordReuseLimit: 3,
	temporaryLockThreshold: 5,
	temporaryLockDurationMin: 15,
	permanentLockThreshold: 10,
	accessTokenTtlSec: 3600,
	refreshTokenTtlSec: 2592000,
	sessionTtlSec: 86400,
	ipWhitelistEnabled: false,
	emailDomainWhitelistEnabled: false,
	corsOriginWhitelistEnabled: false,
};
