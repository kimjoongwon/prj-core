import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { VALIDATION_MESSAGES } from "../constants/validation-messages";
import { applyDecorators } from "./apply";

export interface PasswordDecoratorOptions {
	/** 최소 길이 (기본값: 8) */
	minLength?: number;
	/** 강력한 비밀번호 규칙 적용 (기본값: true) */
	strong?: boolean;
}

/**
 * 비밀번호 강도 검증 정규식
 * 영문 대문자, 소문자, 숫자, 특수문자 중 3가지 이상 포함
 */
const STRONG_PASSWORD_REGEX =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])|(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])|(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;

/**
 * 비밀번호 필드 데코레이터 (순수 class-validator)
 *
 * @example
 * ```typescript
 * class LoginSchema {
 *   @Password()
 *   password: string;
 *
 *   @Password({ minLength: 12, strong: true })
 *   securePassword: string;
 * }
 * ```
 */
export function Password(
	options: PasswordDecoratorOptions = {},
): PropertyDecorator {
	const { minLength = 8, strong = false } = options;

	const decorators: PropertyDecorator[] = [
		IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED }),
		IsString({ message: VALIDATION_MESSAGES.STRING_TYPE }),
		MinLength(minLength, {
			message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH(minLength),
		}),
	];

	if (strong) {
		decorators.push(
			Matches(STRONG_PASSWORD_REGEX, {
				message: VALIDATION_MESSAGES.PASSWORD_WEAK,
			}),
		);
	}

	return applyDecorators(...decorators);
}
