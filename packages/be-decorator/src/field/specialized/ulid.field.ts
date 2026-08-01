import { applyDecorators } from "@nestjs/common";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Matches, NotEquals } from "class-validator";
import { ApiULIDProperty } from "../../property.decorators";
import { ToArray } from "../../transform.decorators";
import { IsNullable } from "../../validator.decorators";
import type { BaseFieldOptions } from "../base/field-options.types";
import { createOptionalField } from "../base/optional-field.factory";

const ULID_PATTERN = /^[0-9A-HJKMNP-TV-Z]{26}$/;

/**
 * 공개 엔티티 ID에 사용하는 ULID 필드 데코레이터입니다.
 */
export function ULIDField(
	options: Omit<ApiPropertyOptions, "type" | "format" | "isArray"> &
		BaseFieldOptions = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [
		Type(() => String),
		Matches(ULID_PATTERN, {
			each: options.each,
			message: "$property must be a valid ULID",
		}),
	];

	if (options.nullable) {
		decorators.push(IsNullable());
	} else {
		decorators.push(NotEquals(null));
	}

	decorators.push(ApiULIDProperty(options));

	if (options.each) {
		decorators.push(ToArray());
	}

	return applyDecorators(...decorators);
}

/**
 * 값이 제공된 경우에만 ULID 형식을 검증하는 선택적 필드 데코레이터입니다.
 */
export const ULIDFieldOptional =
	createOptionalField<BaseFieldOptions>(ULIDField);
