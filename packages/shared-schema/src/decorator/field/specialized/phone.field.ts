import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { NotEquals } from "class-validator";
import { PhoneNumberSerializer } from "../../transform.decorators";
import { IsNullable, IsPhoneNumber } from "../../validator.decorators";
import {
	type BaseFieldOptions,
	type FieldDecoratorOptions,
} from "../base/field-options.types";
import { createOptionalField } from "../base/optional-field.factory";

/**
 * 전화번호 필드 데코레이터
 *
 * 국제 전화번호 형식 검증 및 직렬화
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @PhoneField()
 *   phone: string;
 *
 *   @PhoneField({ nullable: true })
 *   mobile: string | null;
 * }
 * ```
 */
export function PhoneField(
	options: FieldDecoratorOptions<BaseFieldOptions> = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [
		IsPhoneNumber(),
		PhoneNumberSerializer(),
	];

	// Nullable 처리
	if (options.nullable) {
		decorators.push(IsNullable());
	} else {
		decorators.push(NotEquals(null));
	}

	// Swagger 문서화
	if (options.swagger !== false) {
		decorators.push(ApiProperty({ type: String, ...options }));
	}

	return applyDecorators(...decorators);
}

/**
 * Optional 전화번호 필드 데코레이터
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @PhoneFieldOptional()
 *   optionalPhone?: string;
 * }
 * ```
 */
export const PhoneFieldOptional =
	createOptionalField<BaseFieldOptions>(PhoneField);
