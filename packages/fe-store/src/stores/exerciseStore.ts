import { makeAutoObservable } from "mobx";

/** Space 범위 필터 타입 */
export type SpaceScope = "CURRENT" | "INCLUDE_ANCESTORS";

/**
 * ExerciseStore - 운동 종목 목록 UI 상태
 *
 * 운동 종목(Exercise) 목록/상세 페이지의 클라이언트 UI 상태를 관리합니다.
 * 검색어, 페이지네이션, Space 범위 필터 등 UI 상태를 담당합니다.
 * 실제 데이터 fetching은 Orval 생성 React Query 훅이 담당하며,
 * Store는 필터/페이지 상태만 관리합니다.
 *
 * @example
 * ```typescript
 * const exerciseStore = new ExerciseStore();
 *
 * // 검색어 변경 (debounce 처리는 컴포넌트에서)
 * exerciseStore.setSearch("스쿼트");
 *
 * // Space 범위 필터 변경
 * exerciseStore.setSpaceScope("CURRENT");
 *
 * // 페이지 변경
 * exerciseStore.setPage(2);
 *
 * // React Query 훅에 전달
 * const { data } = useGetExercises(exerciseStore.listParams);
 *
 * // 페이지 이탈 시 리셋
 * useEffect(() => {
 *   return () => exerciseStore.reset();
 * }, []);
 * ```
 */
export class ExerciseStore {
	// ============================================================================
	// Observable State
	// ============================================================================

	/** 운동명 검색어 */
	search = "";

	/** 현재 페이지 번호 */
	page = 1;

	/** 페이지당 항목 수 */
	take = 20;

	/** Space 범위 필터 (기본: 상위 Space 포함) */
	spaceScope: SpaceScope = "INCLUDE_ANCESTORS";

	// ============================================================================
	// Constructor
	// ============================================================================

	constructor() {
		makeAutoObservable(this);
	}

	// ============================================================================
	// Computed
	// ============================================================================

	/** 목록 offset */
	get skip(): number {
		return (this.page - 1) * this.take;
	}

	/** useGetExercises 훅에 전달할 파라미터 */
	get listParams(): {
		take: number;
		skip: number;
		search: string;
		spaceScope: SpaceScope;
	} {
		return {
			take: this.take,
			skip: this.skip,
			search: this.search,
			spaceScope: this.spaceScope,
		};
	}

	// ============================================================================
	// Actions
	// ============================================================================

	/**
	 * 검색어 변경 (페이지 1로 리셋)
	 */
	setSearch(search: string): void {
		this.search = search;
		this.page = 1;
	}

	/**
	 * 페이지 변경
	 */
	setPage(page: number): void {
		this.page = page;
	}

	/**
	 * Space 범위 필터 변경 (페이지 1로 리셋)
	 */
	setSpaceScope(scope: SpaceScope): void {
		this.spaceScope = scope;
		this.page = 1;
	}

	/**
	 * 모든 상태 초기값으로 리셋
	 */
	reset(): void {
		this.search = "";
		this.page = 1;
		this.spaceScope = "INCLUDE_ANCESTORS";
	}
}
