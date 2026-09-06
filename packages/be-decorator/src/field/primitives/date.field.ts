import { DateValidation } from "@cocrepo/schema";
import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import type {
	BaseFieldOptions,
	FieldDecoratorOptions,
} from "../base/field-options.types";
import {
	createOptionalField,
	createOptionalFieldMetadata,
} from "../base/optional-field.factory";

/** Schema 검증을 상속한 Entity에 Swagger와 변환만 추가합니다. */
export function DateFieldMetadata(
	options: FieldDecoratorOptions<BaseFieldOptions> = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [Type(() => Date)];
	if (options.swagger !== false)
		decorators.push(ApiProperty({ type: Date, ...options }));
	return applyDecorators(...decorators);
}

/** API 전용 필드에 공통 검증과 Swagger·변환을 함께 적용합니다. */
export function DateField(
	options: FieldDecoratorOptions<BaseFieldOptions> = {},
): PropertyDecorator {
	return applyDecorators(DateValidation(options), DateFieldMetadata(options));
}

export const DateFieldOptional =
	createOptionalField<BaseFieldOptions>(DateField);
export const DateFieldOptionalMetadata =
	createOptionalFieldMetadata<BaseFieldOptions>(DateFieldMetadata);
