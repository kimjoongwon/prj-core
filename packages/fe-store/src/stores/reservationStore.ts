import { makeAutoObservable } from "mobx";
import type { RootStore } from "./rootStore";

/** 예약 필터 타입 */
export interface ReservationFilters {
	status?: string;
	programId?: string;
	userId?: string;
	dateFrom?: string;
	dateTo?: string;
}

/** 예약 데이터 타입 (API Response 기반) */
export interface Reservation {
	id: string;
	status: string;
	programId: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
}

/**
 * ReservationStore - 예약 관리 UI 상태
 *
 * 예약 목록/상세 페이지의 클라이언트 상태를 관리합니다.
 * 선택 상태, 필터, 로딩/에러 상태를 담당합니다.
 * 실제 데이터 fetching은 Orval 생성 React Query 훅이 담당합니다.
 *
 * @example
 * ```typescript
 * const rootStore = new RootStore();
 * rootStore.reservationStore = new ReservationStore(rootStore);
 *
 * // 예약 선택
 * reservationStore.setSelectedId("reservation-1");
 *
 * // 필터 변경
 * reservationStore.setFilters({ status: "CONFIRMED" });
 *
 * // 선택 해제
 * reservationStore.clearSelection();
 * ```
 */
export class ReservationStore {
	readonly rootStore: RootStore;

	// ============================================================================
	// Observable State
	// ============================================================================

	/** 목록 데이터 */
	reservations: Reservation[] = [];

	/** 선택된 예약 ID */
	selectedId: string | null = null;

	/** 필터 상태 */
	filters: ReservationFilters = {};

	/** 로딩 상태 */
	loading = false;

	/** 에러 메시지 */
	error: string | null = null;

	// ============================================================================
	// Constructor
	// ============================================================================

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	// ============================================================================
	// Computed
	// ============================================================================

	/** 선택된 예약 조회 */
	get selectedReservation(): Reservation | undefined {
		return this.reservations.find((r) => r.id === this.selectedId);
	}

	/** 필터링된 항목 수 */
	get filteredCount(): number {
		// 실제 필터링은 API에서 수행하므로 전체 개수 반환
		return this.reservations.length;
	}

	/** 목록 비어있는지 확인 */
	get isEmpty(): boolean {
		return this.reservations.length === 0;
	}

	// ============================================================================
	// Actions - Selection
	// ============================================================================

	/**
	 * 선택 상태 변경
	 */
	setSelectedId(id: string): void {
		this.selectedId = id;
	}

	/**
	 * 선택 해제
	 */
	clearSelection(): void {
		this.selectedId = null;
	}

	// ============================================================================
	// Actions - Filters
	// ============================================================================

	/**
	 * 필터 변경
	 */
	setFilters(filters: Partial<ReservationFilters>): void {
		this.filters = { ...this.filters, ...filters };
	}

	// ============================================================================
	// Actions - Data (React Query 연동용)
	// ============================================================================

	/**
	 * 예약 목록 설정 (React Query data 수신용)
	 */
	setReservations(reservations: Reservation[]): void {
		this.reservations = reservations;
	}

	/**
	 * 로딩 상태 설정
	 */
	setLoading(loading: boolean): void {
		this.loading = loading;
	}

	/**
	 * 에러 설정
	 */
	setError(error: string | null): void {
		this.error = error;
	}

	// ============================================================================
	// Actions - Reset
	// ============================================================================

	/**
	 * 초기화
	 */
	reset(): void {
		this.reservations = [];
		this.selectedId = null;
		this.filters = {};
		this.loading = false;
		this.error = null;
	}
}
