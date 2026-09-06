import type { SecurityPolicy as PrismaSecurityPolicy } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	BooleanValidation,
	DateValidation,
	DateValidationOptional,
	NumberValidation,
	StringValidation,
} from "../../decorators/model-validation";
import { PickSchemaType } from "../../utils/mapped-schema";
import { AbstractSchema } from "../abstract.schema";

/** SecurityPolicy의 DB 필드 타입과 공통 검증입니다. */
export class SecurityPolicySchema
	extends PickSchemaType(AbstractSchema, [
		"id",
		"createdAt",
		"updatedAt",
	] as const)
	implements PrismaSecurityPolicy
{
	securityPolicyId!: PrismaSecurityPolicy["securityPolicyId"];

	@BigIntIdValidation({ description: "ID" })
	declare id: PrismaSecurityPolicy["id"];

	@DateValidation({ description: "생성일" })
	declare createdAt: PrismaSecurityPolicy["createdAt"];

	@DateValidationOptional({ nullable: true, description: "수정일" })
	declare updatedAt: PrismaSecurityPolicy["updatedAt"];

	@StringValidation({ description: "정책 키" })
	key!: PrismaSecurityPolicy["key"];

	@NumberValidation({ description: "최소 비밀번호 길이", min: 4, max: 128 })
	passwordMinLength!: PrismaSecurityPolicy["passwordMinLength"];

	@BooleanValidation({ description: "대문자 필수" })
	passwordRequireUppercase!: PrismaSecurityPolicy["passwordRequireUppercase"];

	@BooleanValidation({ description: "소문자 필수" })
	passwordRequireLowercase!: PrismaSecurityPolicy["passwordRequireLowercase"];

	@BooleanValidation({ description: "숫자 필수" })
	passwordRequireNumber!: PrismaSecurityPolicy["passwordRequireNumber"];

	@BooleanValidation({ description: "특수문자 필수" })
	passwordRequireSpecial!: PrismaSecurityPolicy["passwordRequireSpecial"];

	@NumberValidation({ description: "비밀번호 만료 일수 (0=무제한)", min: 0 })
	passwordExpirationDays!: PrismaSecurityPolicy["passwordExpirationDays"];

	@NumberValidation({ description: "비밀번호 재사용 제한 횟수", min: 0 })
	passwordReuseLimit!: PrismaSecurityPolicy["passwordReuseLimit"];

	@NumberValidation({ description: "일시 잠금 임계값", min: 1 })
	temporaryLockThreshold!: PrismaSecurityPolicy["temporaryLockThreshold"];

	@NumberValidation({ description: "일시 잠금 시간 (분)", min: 1 })
	temporaryLockDurationMin!: PrismaSecurityPolicy["temporaryLockDurationMin"];

	@NumberValidation({ description: "영구 잠금 임계값", min: 1 })
	permanentLockThreshold!: PrismaSecurityPolicy["permanentLockThreshold"];

	@NumberValidation({ description: "Access Token TTL (초)", min: 60 })
	accessTokenTtlSec!: PrismaSecurityPolicy["accessTokenTtlSec"];

	@NumberValidation({ description: "Refresh Token TTL (초)", min: 60 })
	refreshTokenTtlSec!: PrismaSecurityPolicy["refreshTokenTtlSec"];

	@NumberValidation({ description: "세션 TTL (초)", min: 60 })
	sessionTtlSec!: PrismaSecurityPolicy["sessionTtlSec"];

	@BooleanValidation({ description: "IP 화이트리스트 활성화" })
	ipWhitelistEnabled!: PrismaSecurityPolicy["ipWhitelistEnabled"];

	@BooleanValidation({ description: "이메일 도메인 화이트리스트 활성화" })
	emailDomainWhitelistEnabled!: PrismaSecurityPolicy["emailDomainWhitelistEnabled"];

	@BooleanValidation({ description: "CORS Origin 화이트리스트 활성화" })
	corsOriginWhitelistEnabled!: PrismaSecurityPolicy["corsOriginWhitelistEnabled"];
}
