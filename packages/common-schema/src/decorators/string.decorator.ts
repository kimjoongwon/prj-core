import {
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from "class-validator";
import { VALIDATION_MESSAGES } from "../constants/validation-messages";
import { applyDecorators } from "./apply";

export interface StringDecoratorOptions {
	/** 필수 여부 (기본값: true) */
	required?: boolean;
	/** 최소 길이 (기본값: 1) */
	minLength?: number;
	/** 최대 길이 */
	maxLength?: number;
	/** 배열 요소 각각에 적용 */
	each?: boolean;
}

/**
 * 문자열 필드 데코레이터 (순수 class-validator)
 *
 * @example
 * ```typescript
 * class UserSchema {
 *   @String({ minLength: 2, maxLength: 50 })
 *   name: string;
 *
 *   @String({ required: false })
 *   description?: string;
 * }
 * ```
 */
export function String(
	options: StringDecoratorOptions = {},
): PropertyDecorator {
	const { required = true, minLength = 1, maxLength, each = false } = options;

	const decorators: PropertyDecorator[] = [
		IsString({ each, message: VALIDATION_MESSAGES.STRING_TYPE }),
	];

	// 필수 여부
	if (required) {
		decorators.push(
			IsNotEmpty({ each, message: VALIDATION_MESSAGES.REQUIRED }),
		);
	} else {
		decorators.push(IsOptional());
	}

	// 길이 검증
	const minMessage = `${VALIDATION_MESSAGES.MIN_LENGTH}`.replaceAll(
		"{{min}}",
		`${minLength}`,
	);
	decorators.push(
		MinLength(minLength, {
			each,
			message: minMessage,
		}),
	);

	if (maxLength) {
		const maxMessage = `${VALIDATION_MESSAGES.MAX_LENGTH}`.replaceAll(
			"{{max}}",
			`${maxLength}`,
		);
		decorators.push(
			MaxLength(maxLength, {
				each,
				message: maxMessage,
			}),
		);
	}

	return applyDecorators(...decorators);
}

/**
 * 선택적 문자열 필드 데코레이터
 */
export function StringOptional(
	options: Omit<StringDecoratorOptions, "required"> = {},
): PropertyDecorator {
	return String({ ...options, required: false });
}
