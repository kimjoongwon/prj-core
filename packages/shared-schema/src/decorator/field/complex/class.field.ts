import { applyDecorators } from "@nestjs/common";
import { ApiProperty, type ApiPropertyOptions } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, ValidateNested } from "class-validator";
import { type Constructor } from "../../../constant/types";
import { ToArray } from "../../transform.decorators";
import { type BaseFieldOptions } from "../base/field-options.types";
import { applyNullableDecorators } from "../base/nullable.helper";

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
export function ClassField<TClass extends Constructor>(
	getClass: () => TClass,
	options: Omit<ApiPropertyOptions, "type"> & BaseFieldOptions = {},
): PropertyDecorator {
	const decorators: PropertyDecorator[] = [
		Type(getClass),
		ValidateNested({ each: options.each }),
	];

	// 필수 여부 검증
	if (options.required !== false) {
		decorators.push(IsDefined());
	}

	// Nullable 처리
	applyNullableDecorators(decorators, {
		nullable: options.nullable,
	});

	// Swagger 문서화
	if (options.swagger !== false) {
		decorators.push(
			ApiProperty({
				type: () => getClass(),
				...options,
			}),
		);
	}

	// 배열 변환
	if (options.each) {
		decorators.push(ToArray());
	}

	return applyDecorators(...decorators);
}
