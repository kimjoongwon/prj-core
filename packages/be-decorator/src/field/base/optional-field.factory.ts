import { applyDecorators } from "@nestjs/common";
import { IsUndefinable } from "../../validator.decorators";
import type {
	BaseFieldOptions,
	OptionalFieldOptions,
} from "./field-options.types";

/**
 * Optional 필드 데코레이터 생성 팩토리
 *
 * 모든 *FieldOptional 데코레이터의 중복 코드를 제거하기 위한 팩토리 함수
 *
 * @example
 * ```typescript
 * export const StringFieldOptional = createOptionalField(StringField);
 * export const NumberFieldOptional = createOptionalField(NumberField);
 * ```
 *
 * @param fieldDecorator - 기본 필드 데코레이터 함수
 * @returns Optional 필드 데코레이터 함수
 */
export function createOptionalField<T extends BaseFieldOptions>(
	fieldDecorator: (options?: unknown) => PropertyDecorator,
) {
	return (options?: OptionalFieldOptions<T>): PropertyDecorator => {
		return applyDecorators(
			IsUndefinable(),
			fieldDecorator({ required: false, ...options }),
		);
	};
}

/** 선택 입력의 Swagger 표시만 적용하며 검증 조건을 추가하지 않습니다. */
export function createOptionalFieldMetadata<T extends BaseFieldOptions>(
	fieldDecorator: (options?: unknown) => PropertyDecorator,
) {
	return (options?: OptionalFieldOptions<T>): PropertyDecorator =>
		fieldDecorator({ required: false, ...options });
}
