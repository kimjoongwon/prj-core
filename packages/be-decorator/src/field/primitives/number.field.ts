import { NumberValidation } from "@cocrepo/schema";
import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ToArray } from "../../transform.decorators";
import type {
	FieldDecoratorOptions,
	NumberFieldOptions,
} from "../base/field-options.types";
import {
	createOptionalField,
	createOptionalFieldMetadata,
} from "../base/optional-field.factory";

/** Schema 검증을 상속한 Entity에 Swagger와 변환만 추가합니다. */
export function NumberFieldMetadata(
	options: FieldDecoratorOptions<NumberFieldOptions> = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [Type(() => Number)];
	const validationMin =
		typeof options.min === "number" ? options.min : options.minimum;
	const validationMax =
		typeof options.max === "number" ? options.max : options.maximum;
	if (options.swagger !== false)
		decorators.push(
			ApiProperty({
				type: "number",
				...options,
				minimum:
					typeof options.minimum === "number" ? options.minimum : validationMin,
				maximum:
					typeof options.maximum === "number" ? options.maximum : validationMax,
			}),
		);
	if (options.each) decorators.push(ToArray());
	return applyDecorators(...decorators);
}

/** API 전용 필드에 공통 검증과 Swagger·변환을 함께 적용합니다. */
export function NumberField(
	options: FieldDecoratorOptions<NumberFieldOptions> = {},
): PropertyDecorator {
	return applyDecorators(
		NumberValidation(options),
		NumberFieldMetadata(options),
	);
}

export const NumberFieldOptional =
	createOptionalField<NumberFieldOptions>(NumberField);
export const NumberFieldOptionalMetadata =
	createOptionalFieldMetadata<NumberFieldOptions>(NumberFieldMetadata);
