import { makeAutoObservable } from "mobx";

/**
 * TimelineStore - 타임라인 목록/상태 UI 상태
 *
 * 타임라인(Timeline) 목록/상세 페이지의 클라이언트 상태를 관리합니다.
 * 검색 필터, 페이지네이션 상태 등 UI 상태를 담당합니다.
 * 실제 데이터 fetching은 Orval 생성 React Query 훅이 담당하며,
 * Store는 필터/페이지 상태만 관리합니다.
 *
 * @example
 * ```typescript
 * const timelineStore = new TimelineStore();
 *
 * // 검색어 변경
 * timelineStore.setSearch("가을 시즌");
 *
 * // 페이지 변경
 * timelineStore.setPage(2);
 *
 * // React Query 훅에 전달
 * const { data } = useGetTimelines(timelineStore.timelineListParams);
 *
 * // 타임라인 상세에서 세션 검색
 * timelineStore.setSessionSearch("요가");
 * const { data: sessions } = useGetSessions({
 *   timelineId,
 *   ...timelineStore.sessionListParams
 * });
 * ```
 */
export class TimelineStore {
	// ============================================================================
	// Observable State - 타임라인 목록
	// ============================================================================

	/** 타임라인 이름 검색어 */
	search = "";

	/** 현재 페이지 번호 */
	page = 1;

	/** 페이지당 항목 수 */
	take = 10;

	// ============================================================================
	// Observable State - 세션 목록 (타임라인 상세 내)
	// ============================================================================

	/** 세션 이름 검색어 */
	sessionSearch = "";

	/** 세션 목록 현재 페이지 */
	sessionPage = 1;

	/** 세션 목록 페이지당 항목 수 */
	sessionTake = 10;

	// ============================================================================
	// Constructor
	// ============================================================================

	constructor() {
		makeAutoObservable(this);
	}

	// ============================================================================
	// Computed
	// ============================================================================

	/** 타임라인 목록 offset */
	get skip(): number {
		return (this.page - 1) * this.take;
	}

	/** 세션 목록 offset */
	get sessionSkip(): number {
		return (this.sessionPage - 1) * this.sessionTake;
	}

	/** useGetTimelines 훅에 전달할 파라미터 */
	get timelineListParams(): { take: number; skip: number; search: string } {
		return {
			take: this.take,
			skip: this.skip,
			search: this.search,
		};
	}

	/** useGetSessions 훅에 전달할 파라미터 */
	get sessionListParams(): { take: number; skip: number; search: string } {
		return {
			take: this.sessionTake,
			skip: this.sessionSkip,
			search: this.sessionSearch,
		};
	}

	// ============================================================================
	// Actions - 타임라인 목록
	// ============================================================================

	/**
	 * 검색어 변경 (페이지 1로 리셋)
	 */
	setSearch(search: string): void {
		this.search = search;
		this.page = 1;
	}

	/**
	 * 타임라인 목록 페이지 변경
	 */
	setPage(page: number): void {
		this.page = page;
	}

	// ============================================================================
	// Actions - 세션 목록
	// ============================================================================

	/**
	 * 세션 검색어 변경 (세션 페이지 1로 리셋)
	 */
	setSessionSearch(search: string): void {
		this.sessionSearch = search;
		this.sessionPage = 1;
	}

	/**
	 * 세션 목록 페이지 변경
	 */
	setSessionPage(page: number): void {
		this.sessionPage = page;
	}

	// ============================================================================
	// Actions - Reset
	// ============================================================================

	/**
	 * 세션 관련 상태만 초기값으로 리셋
	 */
	resetSessionState(): void {
		this.sessionSearch = "";
		this.sessionPage = 1;
	}

	/**
	 * 모든 상태 초기값으로 리셋
	 */
	reset(): void {
		this.search = "";
		this.page = 1;
		this.sessionSearch = "";
		this.sessionPage = 1;
	}
}
