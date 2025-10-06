import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";
import { VALIDATION_MESSAGES } from "../../constants/validation-messages";
import { ToLowerCase, ToUpperCase } from "../../transform.decorators";
import {
	type FieldDecoratorOptions,
	type StringFieldOptions,
} from "../base/field-options.types";
import { applyNullableDecorators } from "../base/nullable.helper";
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

	// 정규식 패턴 검증
	if (options.pattern) {
		decorators.push(
			Matches(RegExp(options.pattern), {
				message:
					options.message ||
					VALIDATION_MESSAGES.INVALID_FORMAT(options.pattern),
				each: options.each,
			}),
		);
	}

	// Nullable 처리 (문자열 "null" → null 변환 포함)
	applyNullableDecorators(decorators, {
		nullable: options.nullable,
		each: options.each,
		transformStringNull: true, // StringField는 "null" 문자열 변환 지원
	});

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
