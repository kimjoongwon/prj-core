import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";
import { VALIDATION_MESSAGES } from "../constants/validation-messages";
import { applyDecorators } from "./apply";

export interface BooleanDecoratorOptions {
	/** 필수 여부 (기본값: true) */
	required?: boolean;
}

/**
 * 불리언 필드 데코레이터 (순수 class-validator)
 *
 * 입력값을 변환하지 않고 검증합니다.
 *
 * @example
 * ```typescript
 * class SettingsSchema {
 *   @Boolean()
 *   isActive: boolean;
 *
 *   @Boolean({ required: false })
 *   isEnabled?: boolean;
 * }
 * ```
 */
export function Boolean(
	options: BooleanDecoratorOptions = {},
): PropertyDecorator {
	const { required = true } = options;

	const decorators: PropertyDecorator[] = [
		IsBoolean({ message: VALIDATION_MESSAGES.BOOLEAN_TYPE }),
	];

	if (required) {
		decorators.push(IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED }));
	} else {
		decorators.push(IsOptional());
	}

	return applyDecorators(...decorators);
}

/**
 * 선택적 불리언 필드 데코레이터
 */
export function BooleanOptional(): PropertyDecorator {
	return Boolean({ required: false });
}
