import { ULIDValidation } from "@cocrepo/schema";
import { applyDecorators } from "@nestjs/common";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ApiULIDProperty } from "../../property.decorators";
import { ToArray } from "../../transform.decorators";
import type { BaseFieldOptions } from "../base/field-options.types";
import {
	createOptionalField,
	createOptionalFieldMetadata,
} from "../base/optional-field.factory";

/** Schema 검증을 상속한 Entity에 Swagger와 변환만 추가합니다. */
export function ULIDFieldMetadata(
	options: Omit<ApiPropertyOptions, "type" | "format" | "isArray"> &
		BaseFieldOptions = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [
		Type(() => String),
		ApiULIDProperty(options),
	];
	if (options.each) decorators.push(ToArray());
	return applyDecorators(...decorators);
}

/** API 전용 필드에 공통 검증과 Swagger·변환을 함께 적용합니다. */
export function ULIDField(
	options: Omit<ApiPropertyOptions, "type" | "format" | "isArray"> &
		BaseFieldOptions = {},
): PropertyDecorator {
	return applyDecorators(ULIDValidation(options), ULIDFieldMetadata(options));
}

export const ULIDFieldOptional =
	createOptionalField<BaseFieldOptions>(ULIDField);
export const ULIDFieldOptionalMetadata =
	createOptionalFieldMetadata<BaseFieldOptions>(ULIDFieldMetadata);
