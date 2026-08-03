import { DATABASE_ID_MAX, DATABASE_ID_MIN } from "@cocrepo/type/database-id";
import { applyDecorators } from "@nestjs/common";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import {
	NotEquals,
	registerDecorator,
	type ValidationOptions,
} from "class-validator";
import { ApiBigIntIdProperty } from "../../property.decorators";
import {
	BigIntIdPlainSerializer,
	BigIntIdSerializer,
	ToArray,
} from "../../transform.decorators";
import { IsNullable } from "../../validator.decorators";
import type { BaseFieldOptions } from "../base/field-options.types";
import { createOptionalField } from "../base/optional-field.factory";

function IsDatabaseId(
	validationOptions?: ValidationOptions,
): PropertyDecorator {
	return (object, propertyName) => {
		registerDecorator({
			name: "isDatabaseId",
			target: object.constructor,
			propertyName: propertyName as string,
			options: validationOptions,
			validator: {
				validate(value: unknown): boolean {
					return (
						typeof value === "bigint" &&
						value >= DATABASE_ID_MIN &&
						value <= DATABASE_ID_MAX
					);
				},
			},
		});
	};
}

/**
 * 데이터베이스 bigint ID를 wire protocol의 canonical decimal 문자열로 다루는 필드 데코레이터입니다.
 */
export function BigIntIdField(
	options: Omit<ApiPropertyOptions, "type" | "format" | "isArray"> &
		BaseFieldOptions = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [];

	if (options.each) {
		decorators.push(ToArray());
	}

	decorators.push(
		BigIntIdSerializer(),
		BigIntIdPlainSerializer(),
		IsDatabaseId({
			each: options.each,
			message:
				"$property must be a canonical positive signed-BIGINT decimal string",
		}),
	);

	if (options.nullable) {
		decorators.push(IsNullable({ each: options.each }));
	} else {
		decorators.push(NotEquals(null, { each: options.each }));
	}

	decorators.push(ApiBigIntIdProperty(options));

	return applyDecorators(...decorators);
}

/**
 * 값이 제공된 경우에만 canonical decimal bigint ID 형식을 검증하는 선택적 필드 데코레이터입니다.
 */
export const BigIntIdFieldOptional =
	createOptionalField<BaseFieldOptions>(BigIntIdField);
