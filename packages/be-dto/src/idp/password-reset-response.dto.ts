import {
	BooleanField,
	NumberField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator";

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

/**
 * POST /api/forgot-password 응답
 */
export class ForgotPasswordResultDto {
	@StringField({ description: "응답 메시지" })
	message!: string;
}

/**
 * GET /api/reset-password/:token 응답
 */
export class TokenValidationDto {
	@BooleanField({ description: "토큰 유효 여부" })
	valid!: boolean;

	@StringFieldOptional({ description: "이메일 주소" })
	email?: string;

	@StringFieldOptional({ description: "유효하지 않은 이유" })
	reason?: string;
}

/**
 * POST /api/reset-password/:token 성공 응답
 */
export class ResetPasswordResultDto {
	@StringField({ description: "응답 메시지" })
	message!: string;
}

/**
 * POST /api/reset-password/:token 실패 응답
 */
export class ResetPasswordErrorDto {
	@StringField({ description: "에러 코드" })
	error!: string;
}
