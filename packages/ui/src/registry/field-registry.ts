/**
 * FieldRegistry - 필드 메타데이터 레지스트리
 *
 * Entity별 필드 정의를 코드로 관리합니다.
 * 타입 안전한 기본값을 제공하며, DB 오버라이드와 병합됩니다.
 */

import type { EntityFields, FieldDefinition, RegisterOptions } from "./types";

/**
 * FieldRegistry 클래스
 *
 * Entity별 필드 메타데이터를 등록하고 조회하는 싱글톤 레지스트리입니다.
 *
 * @example
 * ```typescript
 * // 필드 등록
 * FieldRegistry.register('User', {
 *   id: { field: 'id', label: 'ID', width: 80 },
 *   name: { field: 'name', label: '이름', width: 120 },
 * });
 *
 * // 필드 조회
 * const nameField = FieldRegistry.get('User', 'name');
 * const allFields = FieldRegistry.getAll('User');
 * ```
 */
class FieldRegistryClass {
	/**
	 * Entity -> Field -> FieldDefinition 맵
	 */
	private registry = new Map<string, Map<string, FieldDefinition>>();

	/**
	 * Entity의 필드 정의를 등록합니다.
	 *
	 * @param entity - Entity 이름 (예: 'User', 'Reservation')
	 * @param fields - 필드 정의 객체
	 * @param options - 등록 옵션
	 *
	 * @example
	 * ```typescript
	 * FieldRegistry.register('User', UserFields);
	 * ```
	 */
	register<T extends string>(
		entity: string,
		fields: EntityFields<T>,
		options: RegisterOptions = {},
	): void {
		const { override = false } = options;

		if (this.registry.has(entity) && !override) {
			console.warn(
				`[FieldRegistry] Entity '${entity}'는 이미 등록되어 있습니다. ` +
					`덮어쓰려면 { override: true } 옵션을 사용하세요.`,
			);
			return;
		}

		const fieldMap = new Map<string, FieldDefinition>();
		for (const [key, value] of Object.entries(fields)) {
			fieldMap.set(key, value as FieldDefinition);
		}

		this.registry.set(entity, fieldMap);
	}

	/**
	 * 특정 Entity의 특정 필드 정의를 반환합니다.
	 *
	 * @param entity - Entity 이름
	 * @param field - 필드명
	 * @returns 필드 정의 또는 undefined
	 *
	 * @example
	 * ```typescript
	 * const emailField = FieldRegistry.get('User', 'email');
	 * if (emailField) {
	 *   console.log(emailField.label); // '이메일'
	 * }
	 * ```
	 */
	get(entity: string, field: string): FieldDefinition | undefined {
		return this.registry.get(entity)?.get(field);
	}

	/**
	 * Entity의 모든 필드 정의를 배열로 반환합니다.
	 *
	 * @param entity - Entity 이름
	 * @returns 필드 정의 배열
	 *
	 * @example
	 * ```typescript
	 * const allUserFields = FieldRegistry.getAll('User');
	 * console.log(allUserFields.length); // 6
	 * ```
	 */
	getAll(entity: string): FieldDefinition[] {
		const fieldMap = this.registry.get(entity);
		return fieldMap ? Array.from(fieldMap.values()) : [];
	}

	/**
	 * Entity의 모든 필드명을 배열로 반환합니다.
	 *
	 * @param entity - Entity 이름
	 * @returns 필드명 배열
	 *
	 * @example
	 * ```typescript
	 * const fieldNames = FieldRegistry.getFields('User');
	 * // ['id', 'name', 'email', 'phone', 'status', 'createdAt']
	 * ```
	 */
	getFields(entity: string): string[] {
		const fieldMap = this.registry.get(entity);
		return fieldMap ? Array.from(fieldMap.keys()) : [];
	}

	/**
	 * Entity가 등록되어 있는지 확인합니다.
	 *
	 * @param entity - Entity 이름
	 * @returns 등록 여부
	 */
	has(entity: string): boolean {
		return this.registry.has(entity);
	}

	/**
	 * Entity의 특정 필드가 등록되어 있는지 확인합니다.
	 *
	 * @param entity - Entity 이름
	 * @param field - 필드명
	 * @returns 등록 여부
	 */
	hasField(entity: string, field: string): boolean {
		return this.registry.get(entity)?.has(field) ?? false;
	}

	/**
	 * 등록된 모든 Entity 이름을 반환합니다.
	 *
	 * @returns Entity 이름 배열
	 */
	getEntities(): string[] {
		return Array.from(this.registry.keys());
	}

	/**
	 * 특정 Entity의 등록을 해제합니다.
	 *
	 * @param entity - Entity 이름
	 * @returns 해제 성공 여부
	 */
	unregister(entity: string): boolean {
		return this.registry.delete(entity);
	}

	/**
	 * 모든 등록을 초기화합니다.
	 * 주로 테스트 환경에서 사용됩니다.
	 */
	clear(): void {
		this.registry.clear();
	}

	/**
	 * 디버깅용: 현재 등록 상태를 출력합니다.
	 */
	debug(): void {
		console.group("[FieldRegistry] 등록 현황");
		for (const [entity, fields] of this.registry) {
			console.log(`${entity}: ${Array.from(fields.keys()).join(", ")}`);
		}
		console.groupEnd();
	}
}

/**
 * FieldRegistry 싱글톤 인스턴스
 *
 * @example
 * ```typescript
 * import { FieldRegistry } from '@cocrepo/ui';
 *
 * // 필드 등록
 * FieldRegistry.register('User', UserFields);
 *
 * // 필드 조회
 * const field = FieldRegistry.get('User', 'email');
 * ```
 */
export const FieldRegistry = new FieldRegistryClass();
