import { UUIDValidation } from "@cocrepo/schema";
import { applyDecorators } from "@nestjs/common";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ApiUUIDProperty } from "../../property.decorators";
import { ToArray } from "../../transform.decorators";
import type { BaseFieldOptions } from "../base/field-options.types";
import { normalizeFieldOptionsForValidation } from "../base/normalize-field-validation-options";
import {
	createOptionalField,
	createOptionalFieldMetadata,
} from "../base/optional-field.factory";

/** Schema 검증을 상속한 Entity에 Swagger와 변환만 추가합니다. */
export function UUIDFieldMetadata(
	options: Omit<ApiPropertyOptions, "type" | "format" | "isArray"> &
		BaseFieldOptions = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [
		Type(() => String),
		ApiUUIDProperty(options),
	];
	if (options.each) decorators.push(ToArray());
	return applyDecorators(...decorators);
}

/** API 전용 필드에 공통 검증과 Swagger·변환을 함께 적용합니다. */
export function UUIDField(
	options: Omit<ApiPropertyOptions, "type" | "format" | "isArray"> &
		BaseFieldOptions = {},
): PropertyDecorator {
	return applyDecorators(
		UUIDValidation(normalizeFieldOptionsForValidation(options)),
		UUIDFieldMetadata(options),
	);
}

export const UUIDFieldOptional =
	createOptionalField<BaseFieldOptions>(UUIDField);
export const UUIDFieldOptionalMetadata =
	createOptionalFieldMetadata<BaseFieldOptions>(UUIDFieldMetadata);
