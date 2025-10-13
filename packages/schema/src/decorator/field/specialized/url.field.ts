import { applyDecorators } from "@nestjs/common";
import { type ApiPropertyOptions } from "@nestjs/swagger";
import { IsUrl } from "class-validator";
import { type StringFieldOptions } from "../base/field-options.types";
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
