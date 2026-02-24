import { makeAutoObservable } from "mobx";

/**
 * GroundStore - 시설 목록 UI 상태
 *
 * 시설(Ground) 목록 페이지의 클라이언트 상태를 관리합니다.
 * 검색 필터, 정렬 상태 등 UI 상태를 담당합니다.
 * 실제 데이터 fetching은 Orval 생성 React Query 훅이 담당하며,
 * Store는 필터/정렬 상태만 관리합니다.
 *
 * @example
 * ```typescript
 * const groundStore = new GroundStore();
 *
 * // 검색어 변경
 * groundStore.setSearch("강남");
 *
 * // 페이지 변경
 * groundStore.setPage(2);
 *
 * // React Query 훅에 전달
 * const { data } = useGetGrounds(groundStore.groundListParams);
 * ```
 */
export class GroundStore {
	// ============================================================================
	// Observable State
	// ============================================================================

	/** 시설명 / 사업자등록번호 검색어 */
	search = "";

	/** 현재 페이지 번호 */
	page = 1;

	/** 페이지당 항목 수 */
	take = 20;

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

	/** useGetGrounds 훅에 전달할 파라미터 */
	get groundListParams(): { take: number; skip: number; search: string } {
		return {
			take: this.take,
			skip: this.skip,
			search: this.search,
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
	 * 모든 상태 초기값으로 리셋
	 */
	reset(): void {
		this.search = "";
		this.page = 1;
	}
}
