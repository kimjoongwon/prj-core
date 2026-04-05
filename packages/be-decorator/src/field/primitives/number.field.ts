import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsInt,
	IsNumber,
	IsPositive,
	Max,
	Min,
	NotEquals,
} from "class-validator";
import { ToArray } from "../../transform.decorators";
import { IsNullable } from "../../validator.decorators";
import type {
	FieldDecoratorOptions,
	NumberFieldOptions,
} from "../base/field-options.types";
import { createOptionalField } from "../base/optional-field.factory";

/**
 * 숫자 필드 데코레이터
 *
 * @example
 * ```typescript
 * class Dto {
 *   @NumberField({ min: 0, max: 100 })
 *   age: number;
 *
 *   @NumberField({ int: true, isPositive: true })
 *   count: number;
 * }
 * ```
 */
export function NumberField(
	options: FieldDecoratorOptions<NumberFieldOptions> = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [Type(() => Number)];
	const validationMin =
		typeof options.min === "number"
			? options.min
			: typeof options.minimum === "number"
				? options.minimum
				: undefined;
	const validationMax =
		typeof options.max === "number"
			? options.max
			: typeof options.maximum === "number"
				? options.maximum
				: undefined;

	// Nullable 처리
	if (options.nullable) {
		decorators.push(IsNullable({ each: options.each }));
	} else {
		decorators.push(NotEquals(null, { each: options.each }));
	}

	// Swagger 문서화
	if (options.swagger !== false) {
		decorators.push(
			ApiProperty({
				type: "number",
				...options,
				minimum:
					typeof options.minimum === "number"
						? options.minimum
						: validationMin,
				maximum:
					typeof options.maximum === "number"
						? options.maximum
						: validationMax,
			}),
		);
	}

	// 배열 변환
	if (options.each) {
		decorators.push(ToArray());
	}

	// 타입 검증 (정수 vs 실수)
	if (options.int) {
		decorators.push(IsInt({ each: options.each }));
	} else {
		decorators.push(IsNumber({}, { each: options.each }));
	}

	// 범위 검증
	if (typeof validationMin === "number") {
		decorators.push(Min(validationMin, { each: options.each }));
	}

	if (typeof validationMax === "number") {
		decorators.push(Max(validationMax, { each: options.each }));
	}

	// 양수 검증
	if (options.isPositive) {
		decorators.push(IsPositive({ each: options.each }));
	}

	return applyDecorators(...decorators);
}

/**
 * Optional 숫자 필드 데코레이터
 *
 * @example
 * ```typescript
 * class Dto {
 *   @NumberFieldOptional({ min: 0 })
 *   optionalAge?: number;
 * }
 * ```
 */
export const NumberFieldOptional =
	createOptionalField<NumberFieldOptions>(NumberField);
