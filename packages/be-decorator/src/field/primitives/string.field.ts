import { StringValidation } from "@cocrepo/schema";
import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ToLowerCase, ToUpperCase } from "../../transform.decorators";
import type {
	FieldDecoratorOptions,
	StringFieldOptions,
} from "../base/field-options.types";
import {
	createOptionalField,
	createOptionalFieldMetadata,
} from "../base/optional-field.factory";

/** Schema 검증을 상속한 Entity에 Swagger와 변환만 추가합니다. */
export function StringFieldMetadata(
	options: FieldDecoratorOptions<StringFieldOptions> = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [Type(() => String)];
	if (options.swagger !== false)
		decorators.push(
			ApiProperty({ type: String, ...options, isArray: options.each }),
		);
	if (options.toLowerCase) decorators.push(ToLowerCase());
	if (options.toUpperCase) decorators.push(ToUpperCase());
	return applyDecorators(...decorators);
}

/** API 전용 필드에 공통 검증과 Swagger·변환을 함께 적용합니다. */
export function StringField(
	options: FieldDecoratorOptions<StringFieldOptions> = {},
): PropertyDecorator {
	return applyDecorators(
		StringValidation(options),
		StringFieldMetadata(options),
	);
}

export const StringFieldOptional =
	createOptionalField<StringFieldOptions>(StringField);
export const StringFieldOptionalMetadata =
	createOptionalFieldMetadata<StringFieldOptions>(StringFieldMetadata);
