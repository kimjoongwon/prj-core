import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, MaxLength, MinLength, NotEquals } from "class-validator";
import { VALIDATION_MESSAGES } from "../../constants/validation-messages";
import { ToLowerCase, ToUpperCase } from "../../transform.decorators";
import { IsNullable } from "../../validator.decorators";
import {
	type FieldDecoratorOptions,
	type StringFieldOptions,
} from "../base/field-options.types";
import { createOptionalField } from "../base/optional-field.factory";

/**
 * 문자열 필드 데코레이터
 *
 * @example
 * ```typescript
 * class Dto {
 *   @StringField({ minLength: 2, maxLength: 50 })
 *   name: string;
 *
 *   @StringField({ pattern: "^[A-Z]+$", toUpperCase: true })
 *   code: string;
 * }
 * ```
 */
export function StringField(
	options: FieldDecoratorOptions<StringFieldOptions> = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [
		Type(() => String),
		IsString({
			each: options.each,
			message: VALIDATION_MESSAGES.STRING_TYPE,
		}),
	];

	// Nullable 처리
	if (options.nullable) {
		decorators.push(IsNullable({ each: options.each }));
	} else {
		decorators.push(NotEquals(null, { each: options.each }));
	}

	// Swagger 문서화
	if (options.swagger !== false) {
		decorators.push(
			ApiProperty({ type: String, ...options, isArray: options.each }),
		);
	}

	// 길이 검증
	const minLength = options.minLength || 1;
	decorators.push(MinLength(minLength, { each: options.each }));

	if (options.maxLength) {
		decorators.push(MaxLength(options.maxLength, { each: options.each }));
	}

	// 대소문자 변환
	if (options.toLowerCase) {
		decorators.push(ToLowerCase());
	}

	if (options.toUpperCase) {
		decorators.push(ToUpperCase());
	}

	return applyDecorators(...decorators);
}

/**
 * Optional 문자열 필드 데코레이터
 *
 * @example
 * ```typescript
 * class Dto {
 *   @StringFieldOptional({ maxLength: 100 })
 *   description?: string;
 * }
 * ```
 */
export const StringFieldOptional =
	createOptionalField<StringFieldOptions>(StringField);
