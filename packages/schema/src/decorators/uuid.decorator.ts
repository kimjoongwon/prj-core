import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { VALIDATION_MESSAGES } from "../constants/validation-messages";
import { applyDecorators } from "./apply";

export interface UUIDDecoratorOptions {
	/** 필수 여부 (기본값: true) */
	required?: boolean;
	/** UUID 버전 (기본값: 4) */
	version?: "3" | "4" | "5" | "all";
	/** 배열 요소 각각에 적용 */
	each?: boolean;
}

/**
 * UUID 필드 데코레이터 (순수 class-validator)
 *
 * @example
 * ```typescript
 * class EntitySchema {
 *   @UUID()
 *   id: string;
 *
 *   @UUID({ each: true })
 *   relatedIds: string[];
 * }
 * ```
 */
export function UUID(options: UUIDDecoratorOptions = {}): PropertyDecorator {
	const { required = true, version = "4", each = false } = options;

	const decorators: PropertyDecorator[] = [
		IsUUID(version, { each, message: VALIDATION_MESSAGES.UUID_FORMAT }),
	];

	if (required) {
		decorators.push(
			IsNotEmpty({ each, message: VALIDATION_MESSAGES.REQUIRED }),
		);
	} else {
		decorators.push(IsOptional());
	}

	return applyDecorators(...decorators);
}

/**
 * 선택적 UUID 필드 데코레이터
 */
export function UUIDOptional(
	options: Omit<UUIDDecoratorOptions, "required"> = {},
): PropertyDecorator {
	return UUID({ ...options, required: false });
}
