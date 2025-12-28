import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { VALIDATION_MESSAGES } from "../constants/validation-messages";
import { applyDecorators } from "./apply";

export interface EnumDecoratorOptions {
	/** 필수 여부 (기본값: true) */
	required?: boolean;
	/** 배열 요소 각각에 적용 */
	each?: boolean;
}

/**
 * 열거형 필드 데코레이터 (순수 class-validator)
 *
 * @example
 * ```typescript
 * enum Status {
 *   ACTIVE = 'ACTIVE',
 *   INACTIVE = 'INACTIVE',
 * }
 *
 * class ItemSchema {
 *   @Enum(Status)
 *   status: Status;
 * }
 * ```
 */
export function Enum(
	enumType: object,
	options: EnumDecoratorOptions = {},
): PropertyDecorator {
	const { required = true, each = false } = options;
	const enumValues = Object.values(enumType);

	const decorators: PropertyDecorator[] = [
		IsEnum(enumType, {
			each,
			message: VALIDATION_MESSAGES.INVALID_ENUM(enumValues.map(String)),
		}),
	];

	if (required) {
		decorators.push(IsNotEmpty({ each, message: VALIDATION_MESSAGES.REQUIRED }));
	} else {
		decorators.push(IsOptional());
	}

	return applyDecorators(...decorators);
}

/**
 * 선택적 열거형 필드 데코레이터
 */
export function EnumOptional(
	enumType: object,
	options: Omit<EnumDecoratorOptions, "required"> = {},
): PropertyDecorator {
	return Enum(enumType, { ...options, required: false });
}
