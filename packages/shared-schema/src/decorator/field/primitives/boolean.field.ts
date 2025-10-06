import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";
import { ToBoolean } from "../../transform.decorators";
import {
	type BaseFieldOptions,
	type FieldDecoratorOptions,
} from "../base/field-options.types";
import { applyNullableDecorators } from "../base/nullable.helper";
import { createOptionalField } from "../base/optional-field.factory";

/**
 * 불리언 필드 데코레이터
 *
 * @example
 * ```typescript
 * class Dto {
 *   @BooleanField()
 *   isActive: boolean;
 *
 *   @BooleanField({ nullable: true })
 *   isVerified: boolean | null;
 * }
 * ```
 */
export function BooleanField(
	options: FieldDecoratorOptions<BaseFieldOptions> = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [ToBoolean(), IsBoolean()];

	// Nullable 처리
	applyNullableDecorators(decorators, {
		nullable: options.nullable,
	});

	// Swagger 문서화
	if (options.swagger !== false) {
		decorators.push(ApiProperty({ type: Boolean, ...options }));
	}

	return applyDecorators(...decorators);
}

/**
 * Optional 불리언 필드 데코레이터
 *
 * @example
 * ```typescript
 * class Dto {
 *   @BooleanFieldOptional()
 *   optionalFlag?: boolean;
 * }
 * ```
 */
export const BooleanFieldOptional =
	createOptionalField<BaseFieldOptions>(BooleanField);
