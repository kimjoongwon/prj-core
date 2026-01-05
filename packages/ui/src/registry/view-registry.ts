/**
 * ViewRegistry - 뷰 설정 레지스트리
 *
 * Entity + View 조합별 기본 설정을 코드로 관리합니다.
 * 어떤 필드를 어떤 순서로 보여줄지, 정렬/페이징 기본값 등을 정의합니다.
 */

import type {
	RegisterOptions,
	SortConfig,
	ViewDefinition,
	ViewType,
} from "./types";

/**
 * 뷰 등록 파라미터
 */
export interface ViewRegistrationParams {
	/** 대상 Entity */
	entity: string;
	/** 뷰 타입 */
	view: ViewType;
	/** 기본 필드 순서 */
	fields: string[];
	/** 기본 정렬 */
	defaultSort?: SortConfig;
	/** 페이지 크기 */
	pageSize?: number;
}

/**
 * ViewRegistry 클래스
 *
 * Entity + View 조합별 기본 설정을 등록하고 조회하는 싱글톤 레지스트리입니다.
 *
 * @example
 * ```typescript
 * // 뷰 등록
 * ViewRegistry.register({
 *   entity: 'User',
 *   view: 'table',
 *   fields: ['name', 'email', 'phone', 'status', 'createdAt'],
 *   defaultSort: { field: 'createdAt', direction: 'desc' },
 *   pageSize: 20,
 * });
 *
 * // 뷰 조회
 * const tableView = ViewRegistry.get('User', 'table');
 * ```
 */
class ViewRegistryClass {
	/**
	 * "Entity:View" -> ViewDefinition 맵
	 */
	private registry = new Map<string, ViewDefinition>();

	/**
	 * 레지스트리 키 생성
	 */
	private createKey(entity: string, view: string): string {
		return `${entity}:${view}`;
	}

	/**
	 * 뷰 정의를 등록합니다.
	 *
	 * @param params - 뷰 등록 파라미터
	 * @param options - 등록 옵션
	 *
	 * @example
	 * ```typescript
	 * ViewRegistry.register({
	 *   entity: 'User',
	 *   view: 'table',
	 *   fields: ['name', 'email', 'phone', 'status', 'createdAt'],
	 *   defaultSort: { field: 'createdAt', direction: 'desc' },
	 *   pageSize: 20,
	 * });
	 * ```
	 */
	register(
		params: ViewRegistrationParams,
		options: RegisterOptions = {},
	): void {
		const { override = false } = options;
		const key = this.createKey(params.entity, params.view);

		if (this.registry.has(key) && !override) {
			console.warn(
				`[ViewRegistry] '${key}'는 이미 등록되어 있습니다. ` +
					`덮어쓰려면 { override: true } 옵션을 사용하세요.`,
			);
			return;
		}

		const definition: ViewDefinition = {
			entity: params.entity,
			view: params.view,
			fields: params.fields,
			defaultSort: params.defaultSort,
			pageSize: params.pageSize,
		};

		this.registry.set(key, definition);
	}

	/**
	 * 특정 Entity + View 조합의 정의를 반환합니다.
	 *
	 * @param entity - Entity 이름
	 * @param view - 뷰 타입
	 * @returns 뷰 정의 또는 undefined
	 *
	 * @example
	 * ```typescript
	 * const tableView = ViewRegistry.get('User', 'table');
	 * if (tableView) {
	 *   console.log(tableView.fields); // ['name', 'email', ...]
	 * }
	 * ```
	 */
	get(entity: string, view: ViewType): ViewDefinition | undefined {
		return this.registry.get(this.createKey(entity, view));
	}

	/**
	 * Entity의 모든 뷰 정의를 반환합니다.
	 *
	 * @param entity - Entity 이름
	 * @returns 뷰 정의 배열
	 *
	 * @example
	 * ```typescript
	 * const userViews = ViewRegistry.getByEntity('User');
	 * // [tableView, formView, detailView]
	 * ```
	 */
	getByEntity(entity: string): ViewDefinition[] {
		const views: ViewDefinition[] = [];
		for (const [key, definition] of this.registry) {
			if (key.startsWith(`${entity}:`)) {
				views.push(definition);
			}
		}
		return views;
	}

	/**
	 * 등록 여부를 확인합니다.
	 *
	 * @param entity - Entity 이름
	 * @param view - 뷰 타입
	 * @returns 등록 여부
	 */
	has(entity: string, view: ViewType): boolean {
		return this.registry.has(this.createKey(entity, view));
	}

	/**
	 * 등록된 모든 키를 반환합니다.
	 *
	 * @returns "Entity:View" 형태의 키 배열
	 */
	getKeys(): string[] {
		return Array.from(this.registry.keys());
	}

	/**
	 * 특정 Entity + View 조합의 등록을 해제합니다.
	 *
	 * @param entity - Entity 이름
	 * @param view - 뷰 타입
	 * @returns 해제 성공 여부
	 */
	unregister(entity: string, view: ViewType): boolean {
		return this.registry.delete(this.createKey(entity, view));
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
		console.group("[ViewRegistry] 등록 현황");
		for (const [key, definition] of this.registry) {
			console.log(`${key}: [${definition.fields.join(", ")}]`);
		}
		console.groupEnd();
	}
}

/**
 * ViewRegistry 싱글톤 인스턴스
 *
 * @example
 * ```typescript
 * import { ViewRegistry } from '@cocrepo/ui';
 *
 * // 뷰 등록
 * ViewRegistry.register({
 *   entity: 'User',
 *   view: 'table',
 *   fields: ['name', 'email', 'status'],
 * });
 *
 * // 뷰 조회
 * const view = ViewRegistry.get('User', 'table');
 * ```
 */
export const ViewRegistry = new ViewRegistryClass();
