import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { VALIDATION_MESSAGES } from "../constants/validation-messages";
import { applyDecorators } from "./apply";

export interface EmailDecoratorOptions {
	/** 필수 여부 (기본값: true) */
	required?: boolean;
}

/**
 * 이메일 필드 데코레이터 (순수 class-validator)
 *
 * 입력값을 변환하지 않고 검증합니다.
 *
 * @example
 * ```typescript
 * class UserSchema {
 *   @Email()
 *   email: string;
 * }
 * ```
 */
export function Email(options: EmailDecoratorOptions = {}): PropertyDecorator {
	const { required = true } = options;

	const decorators: PropertyDecorator[] = [
		IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_FORMAT }),
	];

	if (required) {
		decorators.push(IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED }));
	} else {
		decorators.push(IsOptional());
	}

	return applyDecorators(...decorators);
}

/**
 * 선택적 이메일 필드 데코레이터
 */
export function EmailOptional(): PropertyDecorator {
	return Email({ required: false });
}
