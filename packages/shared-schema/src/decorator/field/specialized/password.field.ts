import { applyDecorators } from "@nestjs/common";
import { type ApiPropertyOptions } from "@nestjs/swagger";
import { IsPassword } from "../../validator.decorators";
import { type StringFieldOptions } from "../base/field-options.types";
import { createOptionalField } from "../base/optional-field.factory";
import { StringField } from "../primitives/string.field";

/**
 * 비밀번호 필드 데코레이터
 *
 * 최소 6자 이상, 영문/숫자/특수문자 포함 검증
 *
 * @example
 * ```typescript
 * class SignUpDto {
 *   @PasswordField()
 *   password: string;
 *
 *   @PasswordField({ minLength: 8 })
 *   strongPassword: string;
 * }
 * ```
 */
export function PasswordField(
	options: Omit<ApiPropertyOptions, "type" | "minLength"> &
		StringFieldOptions = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [
		StringField({ ...options, minLength: 6 }),
		IsPassword(),
	];

	// Note: StringField에서 이미 nullable 처리가 되지만, PasswordField는 추가 검증이 필요
	// 별도로 nullable 처리를 하지 않음 (StringField에서 처리됨)

	return applyDecorators(...decorators);
}

/**
 * Optional 비밀번호 필드 데코레이터
 *
 * @example
 * ```typescript
 * class UpdateDto {
 *   @PasswordFieldOptional()
 *   newPassword?: string;
 * }
 * ```
 */
export const PasswordFieldOptional =
	createOptionalField<StringFieldOptions>(PasswordField);
