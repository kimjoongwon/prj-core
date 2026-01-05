import { makeAutoObservable } from "mobx";

// 회원 상태 (API 타입과 일치)
export type MemberStatus = "active" | "inactive" | "removed";

// 회원 역할
export type MemberRole = "USER" | "ADMIN" | "SUPER_ADMIN";

// Profile 타입
export interface MemberProfile {
	id: string;
	nickname?: string | null;
	avatarFileId?: string | null;
}

// Tenant 타입
export interface MemberTenant {
	id: string;
	role: {
		id: string;
		name: string;
	};
	space: {
		id: string;
		name: string;
	};
}

// Member 타입
export interface Member {
	id: string;
	seq: number;
	name: string;
	email: string;
	phone?: string | null;
	createdAt: string;
	updatedAt: string;
	removedAt: string | null;
	profiles?: MemberProfile[];
	tenants?: MemberTenant[];
}

// 필터 타입
export interface MemberFilters {
	search: string;
	roles: MemberRole[];
	status: MemberStatus | "all";
	createdFrom?: string;
	createdTo?: string;
}

// 페이지네이션 타입
export interface Pagination {
	page: number;
	pageSize: number;
	total: number;
}

// 정렬 타입
export interface Sorting {
	field: string | null;
	order: "asc" | "desc";
}

// 통계 타입
export interface MemberStats {
	total: number;
	active: number;
	inactive: number;
	newThisMonth: number;
}

// API 응답 타입
export interface MemberListResponse {
	data: Member[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
	stats: MemberStats;
}

// Query Params 타입
export interface GetMembersParams {
	page?: number;
	limit?: number;
	search?: string;
	roles?: MemberRole[];
	status?: MemberStatus;
	createdFrom?: string;
	createdTo?: string;
	sortBy?: "seq" | "name" | "email" | "createdAt";
	sortOrder?: "asc" | "desc";
}

/**
 * 회원 목록 Store
 *
 * API 연동을 위한 상태 관리
 * - 실제 데이터는 useGetUsers 훅에서 관리
 * - Store는 필터, 페이지네이션, 선택 상태 관리
 */
export class MemberListStore {
	// 선택 상태
	selectedIds: Set<string> = new Set();

	// 필터
	filters: MemberFilters = {
		search: "",
		roles: [],
		status: "all",
	};

	// 페이지네이션
	pagination: Pagination = {
		page: 1,
		pageSize: 20,
		total: 0,
	};

	// 정렬
	sorting: Sorting = {
		field: "createdAt",
		order: "desc",
	};

	constructor() {
		makeAutoObservable(this);
	}

	// API Query Params 생성
	getQueryParams(): GetMembersParams {
		return {
			page: this.pagination.page,
			limit: this.pagination.pageSize,
			search: this.filters.search || undefined,
			roles: this.filters.roles.length > 0 ? this.filters.roles : undefined,
			status:
				this.filters.status !== "all"
					? (this.filters.status as MemberStatus)
					: undefined,
			createdFrom: this.filters.createdFrom,
			createdTo: this.filters.createdTo,
			sortBy: this.sorting.field as
				| "seq"
				| "name"
				| "email"
				| "createdAt"
				| undefined,
			sortOrder: this.sorting.order as "asc" | "desc",
		};
	}

	// 페이지네이션 업데이트 (API 응답 기반)
	updateFromResponse(response: MemberListResponse) {
		this.pagination.total = response.meta.total;
	}

	// 페이지 변경
	setPage(page: number) {
		this.pagination.page = page;
	}

	// 페이지 사이즈 변경
	setPageSize(pageSize: number) {
		this.pagination.pageSize = pageSize;
		this.pagination.page = 1;
	}

	// 검색어 설정
	setSearch(search: string) {
		this.filters.search = search;
		this.pagination.page = 1;
	}

	// 역할 필터 설정
	setRoleFilter(roles: MemberRole[]) {
		this.filters.roles = roles;
		this.pagination.page = 1;
	}

	// 상태 필터 설정
	setStatusFilter(status: MemberStatus | "all") {
		this.filters.status = status;
		this.pagination.page = 1;
	}

	// 날짜 필터 설정
	setDateFilter(from?: string, to?: string) {
		this.filters.createdFrom = from;
		this.filters.createdTo = to;
		this.pagination.page = 1;
	}

	// 필터 초기화
	resetFilters() {
		this.filters = {
			search: "",
			roles: [],
			status: "all",
		};
		this.pagination.page = 1;
	}

	// 정렬 설정
	setSorting(field: string, order?: "asc" | "desc") {
		if (this.sorting.field === field && !order) {
			this.sorting.order = this.sorting.order === "asc" ? "desc" : "asc";
		} else {
			this.sorting.field = field;
			this.sorting.order = order || "asc";
		}
	}

	// 회원 선택
	selectMember(id: string) {
		if (this.selectedIds.has(id)) {
			this.selectedIds.delete(id);
		} else {
			this.selectedIds.add(id);
		}
		this.selectedIds = new Set(this.selectedIds);
	}

	// 전체 선택
	selectAll(members: Member[]) {
		if (this.selectedIds.size === members.length) {
			this.selectedIds = new Set();
		} else {
			this.selectedIds = new Set(members.map((m) => m.id));
		}
	}

	// 선택 해제
	clearSelection() {
		this.selectedIds = new Set();
	}

	// 전체 선택 여부
	isAllSelected(members: Member[]): boolean {
		return members.length > 0 && this.selectedIds.size === members.length;
	}

	// 일부 선택 여부
	isIndeterminate(members: Member[]): boolean {
		return this.selectedIds.size > 0 && this.selectedIds.size < members.length;
	}

	// 선택된 회원 수
	get selectedCount(): number {
		return this.selectedIds.size;
	}

	// 총 페이지 수
	get totalPages(): number {
		return Math.ceil(this.pagination.total / this.pagination.pageSize);
	}
}
