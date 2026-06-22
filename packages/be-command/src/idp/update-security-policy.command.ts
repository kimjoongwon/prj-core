import type { UpdateSecurityPolicyCommandInput } from "@cocrepo/input";
export class UpdateSecurityPolicyCommand implements UpdateSecurityPolicyCommandInput {
	readonly passwordMinLength?: UpdateSecurityPolicyCommandInput["passwordMinLength"];
	readonly passwordRequireUppercase?: UpdateSecurityPolicyCommandInput["passwordRequireUppercase"];
	readonly passwordRequireLowercase?: UpdateSecurityPolicyCommandInput["passwordRequireLowercase"];
	readonly passwordRequireNumber?: UpdateSecurityPolicyCommandInput["passwordRequireNumber"];
	readonly passwordRequireSpecial?: UpdateSecurityPolicyCommandInput["passwordRequireSpecial"];
	readonly passwordExpirationDays?: UpdateSecurityPolicyCommandInput["passwordExpirationDays"];
	readonly passwordReuseLimit?: UpdateSecurityPolicyCommandInput["passwordReuseLimit"];
	readonly temporaryLockThreshold?: UpdateSecurityPolicyCommandInput["temporaryLockThreshold"];
	readonly temporaryLockDurationMin?: UpdateSecurityPolicyCommandInput["temporaryLockDurationMin"];
	readonly permanentLockThreshold?: UpdateSecurityPolicyCommandInput["permanentLockThreshold"];
	readonly accessTokenTtlSec?: UpdateSecurityPolicyCommandInput["accessTokenTtlSec"];
	readonly refreshTokenTtlSec?: UpdateSecurityPolicyCommandInput["refreshTokenTtlSec"];
	readonly sessionTtlSec?: UpdateSecurityPolicyCommandInput["sessionTtlSec"];
	readonly ipWhitelistEnabled?: UpdateSecurityPolicyCommandInput["ipWhitelistEnabled"];
	readonly emailDomainWhitelistEnabled?: UpdateSecurityPolicyCommandInput["emailDomainWhitelistEnabled"];
	readonly corsOriginWhitelistEnabled?: UpdateSecurityPolicyCommandInput["corsOriginWhitelistEnabled"];

	constructor(input: UpdateSecurityPolicyCommandInput) {
		Object.assign(this, input);
	}
}
