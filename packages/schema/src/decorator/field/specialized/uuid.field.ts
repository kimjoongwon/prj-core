import { applyDecorators } from "@nestjs/common";
import { type ApiPropertyOptions } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { NotEquals } from "class-validator";
import { ApiUUIDProperty } from "../../property.decorators";
import { ToArray } from "../../transform.decorators";
import { IsNullable } from "../../validator.decorators";
import { type BaseFieldOptions } from "../base/field-options.types";
import { createOptionalField } from "../base/optional-field.factory";

/**
 * UUID 필드 데코레이터
 *
 * UUID 형식 검증 (v4)
 *
 * @example
 * ```typescript
 * class EntityDto {
 *   @UUIDField()
 *   id: string;
 *
 *   @UUIDField({ each: true })
 *   relatedIds: string[];
 * }
 * ```
 */
export function UUIDField(
	options: Omit<ApiPropertyOptions, "type" | "format" | "isArray"> &
		BaseFieldOptions = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [Type(() => String)];

	// Nullable 처리
	if (options.nullable) {
		decorators.push(IsNullable());
	} else {
		decorators.push(NotEquals(null));
	}

	// Swagger 문서화 (UUID 포맷 포함)
	decorators.push(ApiUUIDProperty(options));

	// 배열 변환
	if (options.each) {
		decorators.push(ToArray());
	}

	return applyDecorators(...decorators);
}

/**
 * Optional UUID 필드 데코레이터
 *
 * @example
 * ```typescript
 * class EntityDto {
 *   @UUIDFieldOptional()
 *   optionalId?: string;
 * }
 * ```
 */
export const UUIDFieldOptional =
	createOptionalField<BaseFieldOptions>(UUIDField);
