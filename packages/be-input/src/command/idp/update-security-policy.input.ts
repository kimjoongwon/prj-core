export interface UpdateSecurityPolicyCommandInput {
	passwordMinLength?: number;
	passwordRequireUppercase?: boolean;
	passwordRequireLowercase?: boolean;
	passwordRequireNumber?: boolean;
	passwordRequireSpecial?: boolean;
	passwordExpirationDays?: number;
	passwordReuseLimit?: number;
	temporaryLockThreshold?: number;
	temporaryLockDurationMin?: number;
	permanentLockThreshold?: number;
	accessTokenTtlSec?: number;
	refreshTokenTtlSec?: number;
	sessionTtlSec?: number;
	ipWhitelistEnabled?: boolean;
	emailDomainWhitelistEnabled?: boolean;
	corsOriginWhitelistEnabled?: boolean;
}
