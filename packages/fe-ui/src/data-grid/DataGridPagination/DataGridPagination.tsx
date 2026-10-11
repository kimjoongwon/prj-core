"use client";

import type {
	PaginationState,
	RowData,
	Table as TanStackTable,
	Updater,
} from "@tanstack/react-table";
import { makeAutoObservable } from "mobx";
import { useT } from "../../i18n";
import { Pagination } from "../../input/Pagination/Pagination";
import type { DataGridState } from "../DataGrid";

export class DataGridPaginationState {
	totalCount = 0;

	constructor(
		readonly state: DataGridState,
		totalCount = 0,
	) {
		this.totalCount = totalCount;
		makeAutoObservable(this, { state: false }, { autoBind: true });
	}

	toTablePaginationState(): PaginationState {
		const skip = Number(this.state.queryStates.skip) || 0;
		const pageSize = Number(this.state.queryStates.take) || 20;
		return { pageIndex: Math.floor(skip / pageSize), pageSize };
	}

	changeTablePagination(nextPagination: Updater<PaginationState>) {
		const currentPagination = this.toTablePaginationState();
		const updatedPagination =
			typeof nextPagination === "function"
				? nextPagination(currentPagination)
				: nextPagination;
		return this.state.querySetter({
			skip: updatedPagination.pageIndex * updatedPagination.pageSize,
			take: updatedPagination.pageSize,
		});
	}

	setTotalCount(totalCount: number) {
		this.totalCount = totalCount;
	}
}

type DataGridPageItem =
	| {
			kind: "page";
			page: number;
	  }
	| {
			kind: "ellipsis";
			key: string;
	  };

export interface DataGridPaginationProps<TData extends RowData> {
	state: DataGridPaginationState;
	table: TanStackTable<TData>;
}

/** 전체 건수와 페이지 크기에서 1부터 시작하는 총 페이지 수를 계산합니다. */
function getTotalPages(totalCount: number, take: number) {
	const safeTake = take > 0 ? take : 20;

	return Math.max(1, Math.ceil(totalCount / safeTake));
}

/** 현재 페이지 주변과 양 끝 페이지를 ellipsis와 함께 표시할 항목으로 변환합니다. */
function getPageItems(
	currentPage: number,
	totalPages: number,
): DataGridPageItem[] {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, index) => ({
			kind: "page",
			page: index + 1,
		}));
	}

	const pageNumbers = new Set([
		1,
		totalPages,
		Math.max(1, currentPage - 1),
		currentPage,
		Math.min(totalPages, currentPage + 1),
	]);
	const sortedPageNumbers = Array.from(pageNumbers).sort((a, b) => a - b);

	return sortedPageNumbers.flatMap((pageNumber, index) => {
		const previousPageNumber = sortedPageNumbers[index - 1];
		const items: DataGridPageItem[] = [];

		if (previousPageNumber && pageNumber - previousPageNumber > 1) {
			items.push({
				kind: "ellipsis",
				key: `${previousPageNumber}-${pageNumber}`,
			});
		}

		items.push({
			kind: "page",
			page: pageNumber,
		});

		return items;
	});
}

/** DataGrid 하단의 전체 건수와 페이지 이동 컨트롤을 렌더링합니다. */
export function DataGridPaginationView<TData extends RowData>({
	state,
	table,
}: DataGridPaginationProps<TData>) {
	const t = useT();
	const { pageIndex, pageSize } = table.getState().pagination;
	const { totalCount } = state;
	const totalPages = getTotalPages(totalCount, pageSize);
	const page = Math.min(Math.max(1, pageIndex + 1), totalPages);
	const pageItems = getPageItems(page, totalPages);
	const isPreviousDisabled = page <= 1;
	const isNextDisabled = page >= totalPages;

	return (
		<Pagination
			className="flex-col sm:flex-row justify-between items-center gap-4 mt-4 py-4"
			size="sm"
		>
			<Pagination.Summary className="text-sm text-muted">
				{t("총")} {totalCount.toLocaleString()}
				{t("건")}
			</Pagination.Summary>
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.Previous
						isDisabled={isPreviousDisabled}
						onPress={() => {
							table.setPageIndex(Math.max(0, page - 2));
						}}
					>
						<Pagination.PreviousIcon />
						<span>Previous</span>
					</Pagination.Previous>
				</Pagination.Item>
				{pageItems.map((item) =>
					item.kind === "ellipsis" ? (
						<Pagination.Item key={item.key}>
							<Pagination.Ellipsis />
						</Pagination.Item>
					) : (
						<Pagination.Item key={item.page}>
							<Pagination.Link
								isActive={item.page === page}
								onPress={() => {
									table.setPageIndex(item.page - 1);
								}}
							>
								{item.page}
							</Pagination.Link>
						</Pagination.Item>
					),
				)}
				<Pagination.Item>
					<Pagination.Next
						isDisabled={isNextDisabled}
						onPress={() => {
							table.setPageIndex(Math.min(totalPages - 1, page));
						}}
					>
						<span>Next</span>
						<Pagination.NextIcon />
					</Pagination.Next>
				</Pagination.Item>
			</Pagination.Content>
		</Pagination>
	);
}
