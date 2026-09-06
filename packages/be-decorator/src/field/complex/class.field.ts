import { ClassValidation } from "@cocrepo/schema";
import { applyDecorators } from "@nestjs/common";
import { ApiProperty, type ApiPropertyOptions } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ToArray } from "../../transform.decorators";
import type { Constructor } from "@cocrepo/type";
import type { BaseFieldOptions } from "../base/field-options.types";

/** ClassField에 전달할 검증·변환·Swagger 옵션입니다. */
export type ClassFieldOptions = Omit<ApiPropertyOptions, "type"> &
	BaseFieldOptions;

/** 클래스 prototype의 개별 관계 필드에 저장하는 공개 메타데이터 키입니다. */
export const CLASS_FIELD_OPTIONS_METADATA = "cocrepo:field:class-options";

/** 관계 대상만 교체하는 DTO helper가 재사용할 ClassField의 유효 옵션입니다. */
export interface ClassFieldOptionsMetadata {
	/** each는 검증·변환, isArray는 Swagger 배열 여부이며 서로 독립적입니다. */
	readonly fieldOptions: Readonly<
		ClassFieldOptions & {
			required: boolean;
			nullable: boolean;
			each: boolean;
			isArray: boolean;
			swagger: boolean;
		}
	>;
	/** 기존 ApiProperty 호출 옵션이며 swagger:false이면 없습니다. type은 지연 함수입니다. */
	readonly apiPropertyOptions: Readonly<ApiPropertyOptions> | undefined;
}

/**
 * 클래스(중첩 객체) 필드 데코레이터
 *
 * 중첩된 DTO 검증에 사용
 *
 * @example
 * ```typescript
 * class AddressDto {
 *   @StringField()
 *   street: string;
 * }
 *
 * class UserDto {
 *   @ClassField(() => AddressDto)
 *   address: AddressDto;
 *
 *   @ClassField(() => AddressDto, { each: true })
 *   addresses: AddressDto[];
 * }
 * ```
 */
export function ClassFieldMetadata<TClass extends Constructor>(
	getClass: () => TClass,
	options: ClassFieldOptions = {},
): PropertyDecorator {
	const apiPropertyOptions: ApiPropertyOptions | undefined =
		options.swagger !== false
			? { type: () => getClass(), ...options }
			: undefined;
	const fieldMetadata: ClassFieldOptionsMetadata = {
		fieldOptions: {
			...options,
			required: options.required !== false,
			nullable: Boolean(options.nullable),
			each: Boolean(options.each),
			isArray: Boolean(options.isArray),
			swagger: options.swagger !== false,
		},
		apiPropertyOptions,
	};
	const decorators: PropertyDecorator[] = [Type(getClass)];

	// Swagger 문서화
	if (apiPropertyOptions) {
		decorators.push(ApiProperty(apiPropertyOptions));
	}

	// 배열 변환
	if (options.each) {
		decorators.push(ToArray());
	}

	decorators.push((target, propertyKey) => {
		Reflect.defineMetadata(
			CLASS_FIELD_OPTIONS_METADATA,
			fieldMetadata,
			target,
			propertyKey,
		);
	});

	return applyDecorators(...decorators);
}

/** 관계 필드는 기존 중첩 검증과 메타데이터를 함께 소유합니다. */
export function ClassField<TClass extends Constructor>(
	getClass: () => TClass,
	options: ClassFieldOptions = {},
): PropertyDecorator {
	return applyDecorators(
		ClassValidation(options),
		ClassFieldMetadata(getClass, options),
	);
}
