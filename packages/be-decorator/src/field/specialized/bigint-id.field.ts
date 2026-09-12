import { BigIntIdValidation } from "@cocrepo/schema";
import { applyDecorators } from "@nestjs/common";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiBigIntIdProperty } from "../../property.decorators";
import {
	BigIntIdPlainSerializer,
	BigIntIdSerializer,
	ToArray,
} from "../../transform.decorators";
import type { BaseFieldOptions } from "../base/field-options.types";
import { normalizeFieldOptionsForValidation } from "../base/normalize-field-validation-options";
import {
	createOptionalField,
	createOptionalFieldMetadata,
} from "../base/optional-field.factory";

/** Schema 검증을 상속한 Entity에 Swagger와 변환만 추가합니다. */
export function BigIntIdFieldMetadata(
	options: Omit<ApiPropertyOptions, "type" | "format" | "isArray"> &
		BaseFieldOptions = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [];
	if (options.each) decorators.push(ToArray());
	decorators.push(
		BigIntIdSerializer(),
		BigIntIdPlainSerializer(),
		ApiBigIntIdProperty(options),
	);
	return applyDecorators(...decorators);
}

/** API 전용 필드에 공통 검증과 Swagger·변환을 함께 적용합니다. */
export function BigIntIdField(
	options: Omit<ApiPropertyOptions, "type" | "format" | "isArray"> &
		BaseFieldOptions = {},
): PropertyDecorator {
	return applyDecorators(
		BigIntIdValidation(normalizeFieldOptionsForValidation(options)),
		BigIntIdFieldMetadata(options),
	);
}

export const BigIntIdFieldOptional =
	createOptionalField<BaseFieldOptions>(BigIntIdField);
export const BigIntIdFieldOptionalMetadata =
	createOptionalFieldMetadata<BaseFieldOptions>(BigIntIdFieldMetadata);
