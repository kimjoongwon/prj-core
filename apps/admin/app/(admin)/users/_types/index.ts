/**
 * 사용자(회원) 관련 타입 정의
 */

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
