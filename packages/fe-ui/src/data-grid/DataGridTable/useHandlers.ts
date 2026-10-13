"use client";

import type {
	ExpandedState,
	GroupingState,
	RowSelectionState,
	SortingState,
	Updater,
} from "@tanstack/react-table";
import { action } from "mobx";
import { useMemo } from "react";
import type {
	DataGridQueryState,
	DataGridRow,
	DataGridState,
	Key,
} from "../DataGrid";
import { useHandlers as useGroupHandlers } from "../DataGridGroupPanel/useHandlers";
import { useHandlers as usePaginationHandlers } from "../DataGridPagination/useHandlers";
import { combineRowsWithChanges, getSortQueryValues } from "../useHandlers";
import type { DataGridTableState } from "./DataGridTable";

/** query 필터의 groupBy 값을 TanStack grouping 데이터로 읽습니다. */
export const getGrouping = (state: {
	query: DataGridQueryState;
}): GroupingState => {
	const grouping = state.query.filters.groupBy;
	return Array.isArray(grouping)
		? grouping.filter(
				(columnId): columnId is string => typeof columnId === "string",
			)
		: [];
};

/** 지정한 행을 펼친 상태로 기록합니다. */
export const ensureRowExpanded = action(
	<TData extends DataGridRow>(state: DataGridTableState<TData>, rowId: Key) => {
		if (state.expandedRowIds === true) return;
		state.expandedRowIds = { ...state.expandedRowIds, [String(rowId)]: true };
	},
);

/** TanStack 행 ID는 원본 데이터의 id를 그대로 사용합니다. */
const getRowId = (row: DataGridRow) => String(row.id);

/** Table이 책임지는 선택·펼침·정렬 동작과 라이브러리 입력값을 제공합니다. */
export const useHandlers = <TData extends DataGridRow>(
	state: DataGridState<TData>,
) => {
	const groupingHandlers = useGroupHandlers(state.groupPanel);
	const paginationHandlers = usePaginationHandlers(state.pagination);
	const handlers = useMemo(
		() => ({
			getRowId,
			changeExpandedRows: action((nextExpanded: Updater<ExpandedState>) => {
				state.table.expandedRowIds =
					typeof nextExpanded === "function"
						? nextExpanded(state.table.expandedRowIds)
						: nextExpanded;
			}),
			changeSorting: (nextSorting: Updater<SortingState>) => {
				const sorting =
					typeof nextSorting === "function"
						? nextSorting(state.query.sort)
						: nextSorting;
				void state.querySetter({
					sort: sorting.length === 0 ? null : getSortQueryValues(sorting),
					skip: 0,
				});
			},
			changeRowSelection: action(
				(nextSelection: Updater<RowSelectionState>) => {
					const selectedKeys =
						state.table.selectionSource?.selectedKeys ??
						state.table.selectedRowKeys;
					const currentSelection = Object.fromEntries(
						Array.from(selectedKeys, (key) => [key, true]),
					);
					const selection =
						typeof nextSelection === "function"
							? nextSelection(currentSelection)
							: nextSelection;
					const nextKeys = new Set(
						Object.entries(selection)
							.filter(([, selected]) => selected)
							.map(([key]) => key),
					);
					if (state.table.selectionSource?.setSelectedKeys) {
						state.table.selectionSource.setSelectedKeys(nextKeys);
					} else {
						state.table.selectedRowKeys = nextKeys;
					}
					state.table.selection?.onSelectionChange?.(nextKeys);
				},
			),
		}),
		[state],
	);
	const selectedKeys =
		state.table.selectionSource?.selectedKeys ?? state.table.selectedRowKeys;
	return {
		...handlers,
		changeGrouping: groupingHandlers.changeGrouping,
		changeTablePagination: paginationHandlers.changeTablePagination,
		rowsWithChanges: combineRowsWithChanges(state, state.table.rows),
		grouping: getGrouping(state),
		rowSelection: Object.fromEntries(
			Array.from(selectedKeys, (key) => [key, true]),
		),
		pagination: paginationHandlers.pagination,
	};
};
