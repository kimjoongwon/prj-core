import {
	DEFAULT_PASSWORD_MAX_LENGTH,
	DEFAULT_PASSWORD_MIN_LENGTH,
} from "@cocrepo/constant/auth/password-rules";
import { PasswordValidation } from "@cocrepo/schema";
import { applyDecorators } from "@nestjs/common";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { StringFieldOptions } from "../base/field-options.types";
import {
	createOptionalField,
	createOptionalFieldMetadata,
} from "../base/optional-field.factory";
import { StringFieldMetadata } from "../primitives/string.field";

/** Schema 검증을 상속한 Entity에 Swagger와 변환만 추가합니다. */
export function PasswordFieldMetadata(
	options: Omit<ApiPropertyOptions, "type" | "minLength"> &
		StringFieldOptions = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [
		StringFieldMetadata({
			...options,
			minLength: options.minLength ?? DEFAULT_PASSWORD_MIN_LENGTH,
			maxLength: options.maxLength ?? DEFAULT_PASSWORD_MAX_LENGTH,
		}),
	];
	return applyDecorators(...decorators);
}

/** API 전용 필드에 공통 검증과 Swagger·변환을 함께 적용합니다. */
export function PasswordField(
	options: Omit<ApiPropertyOptions, "type" | "minLength"> &
		StringFieldOptions = {},
): PropertyDecorator {
	return applyDecorators(
		PasswordValidation(options),
		PasswordFieldMetadata(options),
	);
}

export const PasswordFieldOptional =
	createOptionalField<StringFieldOptions>(PasswordField);
export const PasswordFieldOptionalMetadata =
	createOptionalFieldMetadata<StringFieldOptions>(PasswordFieldMetadata);
