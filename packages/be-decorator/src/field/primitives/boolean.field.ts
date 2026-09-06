import { BooleanValidation } from "@cocrepo/schema";
import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { ToBoolean } from "../../transform.decorators";
import type {
	BaseFieldOptions,
	FieldDecoratorOptions,
} from "../base/field-options.types";
import {
	createOptionalField,
	createOptionalFieldMetadata,
} from "../base/optional-field.factory";

/** Schema 검증을 상속한 Entity에 Swagger와 변환만 추가합니다. */
export function BooleanFieldMetadata(
	options: FieldDecoratorOptions<BaseFieldOptions> = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [ToBoolean()];
	if (options.swagger !== false)
		decorators.push(ApiProperty({ type: Boolean, ...options }));
	return applyDecorators(...decorators);
}

/** API 전용 필드에 공통 검증과 Swagger·변환을 함께 적용합니다. */
export function BooleanField(
	options: FieldDecoratorOptions<BaseFieldOptions> = {},
): PropertyDecorator {
	return applyDecorators(
		BooleanValidation(options),
		BooleanFieldMetadata(options),
	);
}

export const BooleanFieldOptional =
	createOptionalField<BaseFieldOptions>(BooleanField);
export const BooleanFieldOptionalMetadata =
	createOptionalFieldMetadata<BaseFieldOptions>(BooleanFieldMetadata);
