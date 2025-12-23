/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 인스턴스화 가능한 클래스를 나타내는 제네릭 생성자 타입
 * @template T - 생성자가 생성하는 인스턴스의 타입
 * @template Arguments - 생성자 인자 타입 배열 (기본값: any[])
 *
 * @example
 * class UserDto { constructor(name: string) {} }
 * const UserCtor: Constructor<UserDto, [string]> = UserDto;
 */
export type Constructor<T = any, Arguments extends unknown[] = any[]> = new (
	...arguments_: Arguments
) => T;

/**
 * @deprecated DtoTransformInterceptor가 @ApiResponseEntity 데코레이터의 메타데이터를 사용하여
 * 자동으로 Entity → DTO 변환을 처리하므로, @UseDto 데코레이터는 더 이상 필요하지 않습니다.
 *
 * 이 데코레이터는 하위 호환성을 위해 유지되며, 향후 제거될 예정입니다.
 *
 * @see DtoTransformInterceptor - 자동 DTO 변환을 담당하는 Interceptor
 * @see ApiResponseEntity - DTO 클래스 정보를 메타데이터로 저장하는 데코레이터
 *
 * ---
 *
 * Entity 클래스에 DTO (Data Transfer Object) 클래스를 연결하는 클래스 데코레이터
 * Entity와 DTO 간 자동 변환을 가능하게 함
 *
 * @param dtoClass - 데코레이트된 Entity와 연결할 DTO 클래스 생성자
 * @returns Entity의 prototype에 DTO 클래스를 추가하는 클래스 데코레이터 함수
 *
 * @remarks
 * - Entity의 prototype에 `dtoClass` 속성을 추가하여 런타임 접근 가능
 * - 변환 로직과 함께 사용하여 Entity를 DTO로 변환
 * - FIXME: 지연 평가를 위해 dtoClass를 팩토리 함수로 만드는 것을 고려
 *
 * @example
 * ```typescript
 * @UseDto(UserDto)
 * class UserEntity {
 *   id: number;
 *   name: string;
 * }
 *
 * // 런타임 접근
 * const DtoClass = UserEntity.prototype.dtoClass; // UserDto
 * ```
 */
export function UseDto(dtoClass: Constructor): ClassDecorator {
	return (ctor) => {
		// 런타임 변환을 위해 Entity prototype에 DTO 클래스 추가
		// FIXME: 지연 로딩을 위한 팩토리 함수 패턴 고려: () => dtoClass
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		ctor.prototype.dtoClass = dtoClass;
	};
}
