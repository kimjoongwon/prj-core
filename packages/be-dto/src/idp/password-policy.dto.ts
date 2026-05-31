import { BooleanField, NumberField } from "@cocrepo/decorator";

/**
 * GET /api/password-policy 응답
 */
export class PasswordPolicyDto {
	@NumberField({ description: "최소 길이" })
	minLength!: number;

	@NumberField({ description: "최대 길이" })
	maxLength!: number;

	@BooleanField({ description: "영문 대문자 필수 여부" })
	requireUppercase!: boolean;

	@BooleanField({ description: "영문 소문자 필수 여부" })
	requireLowercase!: boolean;

	@BooleanField({ description: "숫자 필수 여부" })
	requireNumber!: boolean;

	@BooleanField({ description: "특수문자 필수 여부" })
	requireSpecial!: boolean;
}
