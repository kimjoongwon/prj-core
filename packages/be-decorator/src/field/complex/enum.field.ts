import { EnumValidation } from "@cocrepo/schema";
import { applyDecorators } from "@nestjs/common";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiEnumProperty } from "../../property.decorators";
import { ToArray } from "../../transform.decorators";
import { IsUndefinable } from "../../validator.decorators";
import type { BaseFieldOptions } from "../base/field-options.types";

export const EnumFieldKey = "field:enum";

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
export function EnumFieldMetadata<TEnum extends object>(
	getEnum: () => TEnum,
	options: Omit<ApiPropertyOptions, "type" | "enum" | "enumName" | "isArray"> &
		BaseFieldOptions = {},
): PropertyDecorator {
	const enumValue = getEnum();
	const decorators: PropertyDecorator[] = [
		(target: object, propertyKey: string | symbol) => {
			Reflect.defineMetadata(EnumFieldKey, enumValue, target, propertyKey);
		},
	];

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

/** API 전용 enum 필드에 Schema 검증과 Swagger·변환을 함께 적용합니다. */
export function EnumField<TEnum extends object>(
	getEnum: () => TEnum,
	options: Omit<ApiPropertyOptions, "type" | "enum" | "enumName" | "isArray"> &
		BaseFieldOptions = {},
): PropertyDecorator {
	return applyDecorators(
		EnumValidation(getEnum, options),
		EnumFieldMetadata(getEnum, options),
	);
}

/** 선택 입력의 enum 메타데이터만 등록합니다. */
export function EnumFieldOptionalMetadata<TEnum extends object>(
	getEnum: () => TEnum,
	options: Omit<ApiPropertyOptions, "type" | "required" | "enum" | "enumName"> &
		BaseFieldOptions = {},
): PropertyDecorator {
	return EnumFieldMetadata(getEnum, { required: false, ...options });
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
