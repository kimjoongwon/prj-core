import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { Member, MemberRole, MemberStatus, Sorting } from "../_types";

/**
 * 사용자 목록 페이지 훅
 *
 * URL 기반 상태 관리:
 * - queryParams: 필터, 페이지네이션, 정렬
 * - useState: 선택 상태 (URL 불필요)
 */
export const useUsersPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	// === URL에서 상태 읽기 ===
	const search = searchParams.get("search") ?? "";
	const status = (searchParams.get("status") ?? "all") as MemberStatus | "all";
	const page = Number(searchParams.get("page") ?? 1);
	const pageSize = Number(searchParams.get("pageSize") ?? 20);
	const sortField = searchParams.get("sortBy") ?? "createdAt";
	const sortOrder = (searchParams.get("sortOrder") ?? "desc") as "asc" | "desc";

	// 역할 필터 (복수 선택 가능)
	const roles = useMemo<MemberRole[]>(() => {
		const rolesParam = searchParams.get("roles");
		if (!rolesParam) return [];
		return rolesParam.split(",") as MemberRole[];
	}, [searchParams]);

	// 날짜 필터
	const createdFrom = searchParams.get("createdFrom") ?? undefined;
	const createdTo = searchParams.get("createdTo") ?? undefined;

	// === 로컬 상태 (URL 불필요) ===
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	// === URL 업데이트 헬퍼 ===
	const updateParams = useCallback(
		(updates: Record<string, string | undefined>) => {
			const params = new URLSearchParams(searchParams.toString());

			for (const [key, value] of Object.entries(updates)) {
				if (value === undefined || value === "" || value === "all") {
					params.delete(key);
				} else {
					params.set(key, value);
				}
			}

			const queryString = params.toString();
			router.push(queryString ? `?${queryString}` : "?", { scroll: false });
		},
		[router, searchParams],
	);

	// === 필터 액션 ===
	const setSearch = useCallback(
		(value: string) => {
			updateParams({ search: value, page: "1" });
		},
		[updateParams],
	);

	const setStatusFilter = useCallback(
		(value: MemberStatus | "all") => {
			updateParams({ status: value, page: "1" });
		},
		[updateParams],
	);

	const setRoleFilter = useCallback(
		(newRoles: MemberRole[]) => {
			updateParams({
				roles: newRoles.length > 0 ? newRoles.join(",") : undefined,
				page: "1",
			});
		},
		[updateParams],
	);

	const setDateFilter = useCallback(
		(from?: string, to?: string) => {
			updateParams({ createdFrom: from, createdTo: to, page: "1" });
		},
		[updateParams],
	);

	const resetFilters = useCallback(() => {
		router.push("?", { scroll: false });
		setSelectedIds(new Set());
	}, [router]);

	// === 페이지네이션 액션 ===
	const setPage = useCallback(
		(newPage: number) => {
			updateParams({ page: String(newPage) });
		},
		[updateParams],
	);

	const setPageSize = useCallback(
		(newPageSize: number) => {
			updateParams({ pageSize: String(newPageSize), page: "1" });
		},
		[updateParams],
	);

	// === 정렬 액션 ===
	const setSorting = useCallback(
		(field: string, order?: "asc" | "desc") => {
			const newOrder =
				order ?? (sortField === field && sortOrder === "asc" ? "desc" : "asc");
			updateParams({ sortBy: field, sortOrder: newOrder });
		},
		[updateParams, sortField, sortOrder],
	);

	// === 선택 액션 ===
	const selectMember = useCallback((id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	}, []);

	const selectAll = useCallback((members: Member[]) => {
		setSelectedIds((prev) => {
			if (prev.size === members.length) {
				return new Set();
			}
			return new Set(members.map((m) => m.id));
		});
	}, []);

	const clearSelection = useCallback(() => {
		setSelectedIds(new Set());
	}, []);

	// === Computed ===
	const filters = useMemo(
		() => ({
			search,
			roles,
			status,
			createdFrom,
			createdTo,
		}),
		[search, roles, status, createdFrom, createdTo],
	);

	const sorting: Sorting = useMemo(
		() => ({
			field: sortField,
			order: sortOrder,
		}),
		[sortField, sortOrder],
	);

	const pagination = useMemo(
		() => ({
			page,
			pageSize,
			total: 0, // API 응답에서 업데이트
		}),
		[page, pageSize],
	);

	const isAllSelected = useCallback(
		(members: Member[]) => {
			return members.length > 0 && selectedIds.size === members.length;
		},
		[selectedIds],
	);

	const isIndeterminate = useCallback(
		(members: Member[]) => {
			return selectedIds.size > 0 && selectedIds.size < members.length;
		},
		[selectedIds],
	);

	// === 네비게이션 ===
	const navigateToDetail = useCallback(
		(id: string) => {
			(router.push as (url: string) => void)(`/users/${id}`);
		},
		[router],
	);

	return {
		// 상태
		filters,
		sorting,
		pagination,
		selectedIds,
		selectedCount: selectedIds.size,

		// 필터 액션
		setSearch,
		setStatusFilter,
		setRoleFilter,
		setDateFilter,
		resetFilters,

		// 페이지네이션 액션
		setPage,
		setPageSize,

		// 정렬 액션
		setSorting,

		// 선택 액션
		selectMember,
		selectAll,
		clearSelection,
		isAllSelected,
		isIndeterminate,

		// 네비게이션
		navigateToDetail,
	};
};
