import { applyDecorators } from "@nestjs/common";
import { type ApiPropertyOptions } from "@nestjs/swagger";
import { IsUrl } from "class-validator";
import { type StringFieldOptions } from "../base/field-options.types";
import { applyNullableDecorators } from "../base/nullable.helper";
import { createOptionalField } from "../base/optional-field.factory";
import { StringField } from "../primitives/string.field";

/**
 * URL 필드 데코레이터
 *
 * URL 형식 검증
 *
 * @example
 * ```typescript
 * class WebsiteDto {
 *   @URLField()
 *   homepage: string;
 *
 *   @URLField({ each: true })
 *   socialLinks: string[];
 * }
 * ```
 */
export function URLField(
	options: Omit<ApiPropertyOptions, "type"> & StringFieldOptions = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [
		StringField(options),
		IsUrl({}, { each: true }),
	];

	// StringField에서 nullable 처리가 되지만, 여기서도 명시적으로 처리
	// (중복이지만 일관성을 위해 유지 - 기존 코드 동작 유지)
	applyNullableDecorators(decorators, {
		nullable: options.nullable,
		each: options.each,
	});

	return applyDecorators(...decorators);
}

/**
 * Optional URL 필드 데코레이터
 *
 * @example
 * ```typescript
 * class WebsiteDto {
 *   @URLFieldOptional()
 *   optionalLink?: string;
 * }
 * ```
 */
export const URLFieldOptional =
	createOptionalField<StringFieldOptions>(URLField);
