import { applyDecorators } from "@nestjs/common";
import { type ApiPropertyOptions } from "@nestjs/swagger";
import { IsTmpKey as IsTemporaryKey } from "../../validator.decorators";
import { type StringFieldOptions } from "../base/field-options.types";
import { applyNullableDecorators } from "../base/nullable.helper";
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

	// StringField에서 nullable 처리가 되지만, 여기서도 명시적으로 처리
	// (중복이지만 일관성을 위해 유지 - 기존 코드 동작 유지)
	applyNullableDecorators(decorators, {
		nullable: options.nullable,
	});

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
