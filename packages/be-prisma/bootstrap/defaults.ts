// ============================================================================
// Security Policy 시드 데이터
// ============================================================================

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
