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
{
	securityPolicyId!: string;

	@BigIntIdValidation({ description: "ID" })
	declare id: bigint;

	@DateValidation({ description: "생성일" })
	declare createdAt: Date;

	@DateValidationOptional({ nullable: true, description: "수정일" })
	declare updatedAt: Date | null;

	@StringValidation({ description: "정책 키" })
	key!: string;

	@NumberValidation({ description: "최소 비밀번호 길이", min: 4, max: 128 })
	passwordMinLength!: number;

	@BooleanValidation({ description: "대문자 필수" })
	passwordRequireUppercase!: boolean;

	@BooleanValidation({ description: "소문자 필수" })
	passwordRequireLowercase!: boolean;

	@BooleanValidation({ description: "숫자 필수" })
	passwordRequireNumber!: boolean;

	@BooleanValidation({ description: "특수문자 필수" })
	passwordRequireSpecial!: boolean;

	@NumberValidation({ description: "비밀번호 만료 일수 (0=무제한)", min: 0 })
	passwordExpirationDays!: number;

	@NumberValidation({ description: "비밀번호 재사용 제한 횟수", min: 0 })
	passwordReuseLimit!: number;

	@NumberValidation({ description: "일시 잠금 임계값", min: 1 })
	temporaryLockThreshold!: number;

	@NumberValidation({ description: "일시 잠금 시간 (분)", min: 1 })
	temporaryLockDurationMin!: number;

	@NumberValidation({ description: "영구 잠금 임계값", min: 1 })
	permanentLockThreshold!: number;

	@NumberValidation({ description: "Access Token TTL (초)", min: 60 })
	accessTokenTtlSec!: number;

	@NumberValidation({ description: "Refresh Token TTL (초)", min: 60 })
	refreshTokenTtlSec!: number;

	@NumberValidation({ description: "세션 TTL (초)", min: 60 })
	sessionTtlSec!: number;

	@BooleanValidation({ description: "IP 화이트리스트 활성화" })
	ipWhitelistEnabled!: boolean;

	@BooleanValidation({ description: "이메일 도메인 화이트리스트 활성화" })
	emailDomainWhitelistEnabled!: boolean;

	@BooleanValidation({ description: "CORS Origin 화이트리스트 활성화" })
	corsOriginWhitelistEnabled!: boolean;
}
