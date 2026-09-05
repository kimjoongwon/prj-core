import { SecurityPolicy } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";

export class SecurityPolicyDto extends EntityResponseType(SecurityPolicy, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"key",
		"passwordMinLength",
		"passwordRequireUppercase",
		"passwordRequireLowercase",
		"passwordRequireNumber",
		"passwordRequireSpecial",
		"passwordExpirationDays",
		"passwordReuseLimit",
		"temporaryLockThreshold",
		"temporaryLockDurationMin",
		"permanentLockThreshold",
		"accessTokenTtlSec",
		"refreshTokenTtlSec",
		"sessionTtlSec",
		"ipWhitelistEnabled",
		"emailDomainWhitelistEnabled",
		"corsOriginWhitelistEnabled",
	] as const,
}) {}
