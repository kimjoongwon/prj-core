import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate } from "class-validator";
import {
	type BaseFieldOptions,
	type FieldDecoratorOptions,
} from "../base/field-options.types";
import { applyNullableDecorators } from "../base/nullable.helper";
import { createOptionalField } from "../base/optional-field.factory";

/**
 * 날짜 필드 데코레이터
 *
 * @example
 * ```typescript
 * class Dto {
 *   @DateField()
 *   createdAt: Date;
 *
 *   @DateField({ nullable: true })
 *   deletedAt: Date | null;
 * }
 * ```
 */
export function DateField(
	options: FieldDecoratorOptions<BaseFieldOptions> = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [Type(() => Date), IsDate()];

	// Nullable 처리
	applyNullableDecorators(decorators, {
		nullable: options.nullable,
	});

	// Swagger 문서화
	if (options.swagger !== false) {
		decorators.push(ApiProperty({ type: Date, ...options }));
	}

	return applyDecorators(...decorators);
}

/**
 * Optional 날짜 필드 데코레이터
 *
 * @example
 * ```typescript
 * class Dto {
 *   @DateFieldOptional()
 *   optionalDate?: Date;
 * }
 * ```
 */
export const DateFieldOptional =
	createOptionalField<BaseFieldOptions>(DateField);
