import { Type } from "class-transformer";
import {
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	Max,
	Min,
} from "class-validator";
import { VALIDATION_MESSAGES } from "../constants/validation-messages";
import { applyDecorators } from "./apply";

export interface NumberDecoratorOptions {
	/** 필수 여부 (기본값: true) */
	required?: boolean;
	/** 정수만 허용 (기본값: false) */
	int?: boolean;
	/** 최소값 */
	min?: number;
	/** 최대값 */
	max?: number;
	/** 배열 요소 각각에 적용 */
	each?: boolean;
}

/**
 * 숫자 필드 데코레이터 (순수 class-validator)
 *
 * @example
 * ```typescript
 * class ProductSchema {
 *   @Number({ min: 0 })
 *   price: number;
 *
 *   @Number({ int: true, min: 0, max: 100 })
 *   quantity: number;
 * }
 * ```
 */
export function Number(options: NumberDecoratorOptions = {}): PropertyDecorator {
	const { required = true, int = false, min, max, each = false } = options;

	const decorators: PropertyDecorator[] = [
		Type(() => globalThis.Number),
	];

	if (int) {
		decorators.push(IsInt({ each, message: VALIDATION_MESSAGES.NUMBER_TYPE }));
	} else {
		decorators.push(
			IsNumber({}, { each, message: VALIDATION_MESSAGES.NUMBER_TYPE }),
		);
	}

	if (required) {
		decorators.push(IsNotEmpty({ each, message: VALIDATION_MESSAGES.REQUIRED }));
	} else {
		decorators.push(IsOptional());
	}

	if (min !== undefined) {
		decorators.push(
			Min(min, { each, message: VALIDATION_MESSAGES.MIN_VALUE(min) }),
		);
	}

	if (max !== undefined) {
		decorators.push(
			Max(max, { each, message: VALIDATION_MESSAGES.MAX_VALUE(max) }),
		);
	}

	return applyDecorators(...decorators);
}

/**
 * 선택적 숫자 필드 데코레이터
 */
export function NumberOptional(
	options: Omit<NumberDecoratorOptions, "required"> = {},
): PropertyDecorator {
	return Number({ ...options, required: false });
}

/**
 * 정수 필드 데코레이터
 */
export function Int(
	options: Omit<NumberDecoratorOptions, "int"> = {},
): PropertyDecorator {
	return Number({ ...options, int: true });
}

/**
 * 선택적 정수 필드 데코레이터
 */
export function IntOptional(
	options: Omit<NumberDecoratorOptions, "int" | "required"> = {},
): PropertyDecorator {
	return Number({ ...options, int: true, required: false });
}
