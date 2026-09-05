import { SecurityPolicy } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

/**
 * 보안 정책 수정 DTO
 * - key, id, createdAt, updatedAt은 수정 불가
 * - 나머지 필드는 모두 선택적
 */
export class UpdateSecurityPolicyDto extends PartialType(
	PickType(SecurityPolicy, [
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
	] as const),
) {}
