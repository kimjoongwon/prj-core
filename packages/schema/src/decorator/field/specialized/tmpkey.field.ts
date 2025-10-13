import { applyDecorators } from "@nestjs/common";
import { type ApiPropertyOptions } from "@nestjs/swagger";
import { IsTmpKey as IsTemporaryKey } from "../../validator.decorators";
import { type StringFieldOptions } from "../base/field-options.types";
import { createOptionalField } from "../base/optional-field.factory";
import { StringField } from "../primitives/string.field";

/**
 * 임시 키 필드 데코레이터
 *
 * 임시 키(TmpKey) 형식 검증
 *
 * @example
 * ```typescript
 * class UploadDto {
 *   @TmpKeyField()
 *   fileKey: string;
 *
 *   @TmpKeyField({ each: true })
 *   fileKeys: string[];
 * }
 * ```
 */
export function TmpKeyField(
	options: Omit<ApiPropertyOptions, "type"> & StringFieldOptions = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [
		StringField(options),
		IsTemporaryKey({ each: options.each }),
	];

	return applyDecorators(...decorators);
}

/**
 * Optional 임시 키 필드 데코레이터
 *
 * @example
 * ```typescript
 * class UploadDto {
 *   @TmpKeyFieldOptional()
 *   optionalKey?: string;
 * }
 * ```
 */
export const TmpKeyFieldOptional =
	createOptionalField<StringFieldOptions>(TmpKeyField);
