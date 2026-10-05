import { TmpKeyValidation } from "@cocrepo/schema";
import { applyDecorators } from "@nestjs/common";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { StringFieldOptions } from "../base/field-options.types";
import {
	createOptionalField,
	createOptionalFieldMetadata,
} from "../base/optional-field.factory";
import { StringFieldMetadata } from "../primitives/string.field";

/** Schema 검증을 상속한 Entity에 Swagger와 변환만 추가합니다. */
export function TmpKeyFieldMetadata(
	options: Omit<ApiPropertyOptions, "type"> & StringFieldOptions = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [StringFieldMetadata(options)];
	return applyDecorators(...decorators);
}

/** API 전용 필드에 공통 검증과 Swagger·변환을 함께 적용합니다. */
export function TmpKeyField(
	options: Omit<ApiPropertyOptions, "type"> & StringFieldOptions = {},
): PropertyDecorator {
	return applyDecorators(
		TmpKeyValidation(options),
		TmpKeyFieldMetadata(options),
	);
}

export const TmpKeyFieldOptional =
	createOptionalField<StringFieldOptions>(TmpKeyField);
export const TmpKeyFieldOptionalMetadata =
	createOptionalFieldMetadata<StringFieldOptions>(TmpKeyFieldMetadata);
