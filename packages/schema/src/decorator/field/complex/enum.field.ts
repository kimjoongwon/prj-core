import { applyDecorators } from "@nestjs/common";
import { type ApiPropertyOptions } from "@nestjs/swagger";
import { IsEnum, NotEquals } from "class-validator";
import { ApiEnumProperty } from "../../property.decorators";
import { ToArray } from "../../transform.decorators";
import { IsNullable, IsUndefinable } from "../../validator.decorators";
import { type BaseFieldOptions } from "../base/field-options.types";

/**
 * Enum 필드 데코레이터
 *
 * @example
 * ```typescript
 * enum Status {
 *   Active = 'ACTIVE',
 *   Inactive = 'INACTIVE'
 * }
 *
 * class Dto {
 *   @EnumField(() => Status)
 *   status: Status;
 *
 *   @EnumField(() => Status, { each: true })
 *   statuses: Status[];
 * }
 * ```
 */
export function EnumField<TEnum extends object>(
	getEnum: () => TEnum,
	options: Omit<ApiPropertyOptions, "type" | "enum" | "enumName" | "isArray"> &
		BaseFieldOptions = {},
): PropertyDecorator {
	const enumValue = getEnum();
	const decorators: PropertyDecorator[] = [
		IsEnum(enumValue, { each: options.each }),
	];

	// Nullable 처리
	if (options.nullable) {
		decorators.push(IsNullable());
	} else {
		decorators.push(NotEquals(null));
	}

	// 배열 변환
	if (options.each) {
		decorators.push(ToArray());
	}

	// Swagger 문서화
	if (options.swagger !== false) {
		decorators.push(
			ApiEnumProperty(getEnum, { ...options, isArray: options.each }),
		);
	}

	return applyDecorators(...decorators);
}

/**
 * Optional Enum 필드 데코레이터
 *
 * @example
 * ```typescript
 * class Dto {
 *   @EnumFieldOptional(() => Status)
 *   optionalStatus?: Status;
 * }
 * ```
 */
export function EnumFieldOptional<TEnum extends object>(
	getEnum: () => TEnum,
	options: Omit<ApiPropertyOptions, "type" | "required" | "enum" | "enumName"> &
		BaseFieldOptions = {},
): PropertyDecorator {
	return applyDecorators(
		IsUndefinable(),
		EnumField(getEnum, { required: false, ...options }),
	);
}
