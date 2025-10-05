/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Constructor } from "./use-dto.decorator";

/**
 * DTO 클래스에 Entity 클래스를 연결하는 클래스 데코레이터
 * DTO와 Entity 간 양방향 변환을 가능하게 함
 *
 * @param entityClass - 데코레이트된 DTO와 연결할 Entity 클래스 생성자
 * @returns DTO의 prototype에 Entity 클래스를 추가하는 클래스 데코레이터 함수
 *
 * @remarks
 * - DTO의 prototype에 `entityClass` 속성을 추가하여 런타임 접근 가능
 * - DTO에서 Entity로의 역변환 가능 (예: 데이터베이스 저장용)
 * - FIXME: 지연 평가를 위해 entityClass를 팩토리 함수로 만드는 것을 고려
 * - 주석 처리된 검증 로직을 엄격한 런타임 체크를 위해 재활성화 가능
 *
 * @example
 * ```typescript
 * @UseEntity(UserEntity)
 * class UserDto {
 *   id: number;
 *   name: string;
 * }
 *
 * // 런타임 접근
 * const EntityClass = UserDto.prototype.entityClass; // UserEntity
 * ```
 */
export function UseEntity(entityClass: Constructor): ClassDecorator {
	return (ctor) => {
		// 역변환을 위해 DTO prototype에 Entity 클래스 추가
		// FIXME: 지연 로딩을 위한 팩토리 함수 패턴 고려: () => entityClass

		// 선택적 런타임 검증 (현재 비활성화)
		// if (!(<unknown>entityClass)) {
		// 	throw new Error("UseEntity decorator requires entityClass");
		// }

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		ctor.prototype.entityClass = entityClass;
	};
}
