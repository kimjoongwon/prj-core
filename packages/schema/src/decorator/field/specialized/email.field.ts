import { applyDecorators } from "@nestjs/common";
import { ApiProperty, type ApiPropertyOptions } from "@nestjs/swagger";
import { IsEmail } from "class-validator";
import { type StringFieldOptions } from "../base/field-options.types";
import { createOptionalField } from "../base/optional-field.factory";
import { StringField } from "../primitives/string.field";

/**
 * 이메일 필드 데코레이터
 *
 * 자동으로 소문자 변환 적용
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @EmailField()
 *   email: string;
 *
 *   @EmailField({ nullable: true })
 *   alternativeEmail: string | null;
 * }
 * ```
 */
export function EmailField(
	options: Omit<ApiPropertyOptions, "type"> & StringFieldOptions = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [
		IsEmail(),
		StringField({ toLowerCase: true, ...options }),
	];

	// StringField에서 nullable 처리가 되지만, 추가 데코레이터 적용 가능
	// (현재는 StringField에서 처리됨)

	// Swagger 문서화 (StringField와 중복되지만 명시적으로 추가)
	if (options.swagger !== false) {
		decorators.push(ApiProperty({ type: String, ...options }));
	}

	return applyDecorators(...decorators);
}

/**
 * Optional 이메일 필드 데코레이터
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @EmailFieldOptional()
 *   optionalEmail?: string;
 * }
 * ```
 */
export const EmailFieldOptional =
	createOptionalField<StringFieldOptions>(EmailField);
