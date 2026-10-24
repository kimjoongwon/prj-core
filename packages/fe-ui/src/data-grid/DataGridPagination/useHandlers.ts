"use client";

import type { PaginationState, Updater } from "@tanstack/react-table";
import type { DataGridPaginationState } from "./DataGridPagination";

type DataGridPageItem =
	| { kind: "page"; page: number }
	| { kind: "ellipsis"; key: string };

/** skip/take를 TanStack의 pageIndex/pageSize로 변환합니다. */
export const toTablePaginationState = (
	state: DataGridPaginationState,
): PaginationState => {
	const { skip, take } = state.query.pagination;
	return { pageIndex: Math.floor(skip / take), pageSize: take };
};

/** 전체 건수와 페이지 크기에서 페이지 수를 계산합니다. */
const getTotalPages = (state: DataGridPaginationState) =>
	Math.max(1, Math.ceil(state.totalCount / state.query.pagination.take));

/** 현재 페이지 주변과 양 끝 페이지를 생략 기호와 함께 반환합니다. */
export const getPageItems = (
	page: number,
	totalPages: number,
): DataGridPageItem[] => {
	if (totalPages <= 7)
		return Array.from({ length: totalPages }, (_, index) => ({
			kind: "page",
			page: index + 1,
		}));
	const pageNumbers = [
		...new Set([
			1,
			totalPages,
			Math.max(1, page - 1),
			page,
			Math.min(totalPages, page + 1),
		]),
	].sort((left, right) => left - right);
	return pageNumbers.flatMap((pageNumber, index) => {
		const previousPage = pageNumbers[index - 1];
		const pageItems: DataGridPageItem[] = [];
		if (previousPage && pageNumber - previousPage > 1)
			pageItems.push({
				kind: "ellipsis",
				key: `${previousPage}-${pageNumber}`,
			});
		pageItems.push({ kind: "page", page: pageNumber });
		return pageItems;
	});
};

/** 페이지 변경을 query의 skip/take로 기록합니다. */
export const changeTablePagination = (
	state: DataGridPaginationState,
	nextPagination: Updater<PaginationState>,
) => {
	const currentPagination = toTablePaginationState(state);
	const pagination =
		typeof nextPagination === "function"
			? nextPagination(currentPagination)
			: nextPagination;
	return state.querySetter({
		skip: pagination.pageIndex * pagination.pageSize,
		take: pagination.pageSize,
	});
};

/** 페이지 표시 데이터와 이동 동작을 제공합니다. */
export const useHandlers = (state: DataGridPaginationState) => {
	const currentPage = () =>
		Math.min(
			Math.max(1, toTablePaginationState(state).pageIndex + 1),
			getTotalPages(state),
		);
	const moveToPage = (page: number) => {
		void changeTablePagination(state, {
			pageIndex: page - 1,
			pageSize: state.query.pagination.take,
		});
	};
	const handlers = {
		changeTablePagination: (pagination: Updater<PaginationState>) =>
			changeTablePagination(state, pagination),
		previousPage: () => moveToPage(Math.max(1, currentPage() - 1)),
		nextPage: () => moveToPage(Math.min(getTotalPages(state), currentPage() + 1)),
		pageHandler: (page: number) => () => moveToPage(page),
	};
	const pagination = toTablePaginationState(state);
	const totalPages = getTotalPages(state);
	const page = Math.min(Math.max(1, pagination.pageIndex + 1), totalPages);
	return {
		...handlers,
		pagination,
		page,
		pageItems: getPageItems(page, totalPages),
		isPreviousDisabled: page <= 1,
		isNextDisabled: page >= totalPages,
	};
};
