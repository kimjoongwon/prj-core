"use client";

import type { DataGridGroupableColumnItem } from "@cocrepo/type";
import type { GroupingState, Updater } from "@tanstack/react-table";
import { type DragEvent, useMemo } from "react";
import { getGroupableColumnItems } from "../columns/columnConfig";
import type { DataGridRow } from "../DataGrid";
import { getGrouping } from "../DataGridTable/useHandlers";
import type { DataGridGroupPanelState } from "./DataGridGroupPanel";

const GROUP_COLUMN_DATA_TYPE = "application/x-cocrepo-data-grid-column-id";

/** 중복 없이 지정한 위치에 그룹 기준을 넣습니다. */
const getGroupingWithColumn = (
	grouping: GroupingState,
	columnId: string,
	insertIndex = grouping.length,
) => {
	const nextGrouping = grouping.filter((id) => id !== columnId);
	const nextIndex = Math.min(Math.max(insertIndex, 0), nextGrouping.length);
	return [
		...nextGrouping.slice(0, nextIndex),
		columnId,
		...nextGrouping.slice(nextIndex),
	];
};

/** 현재 query를 기준으로 그룹 추가·제거·이동·드래그 동작을 제공합니다. */
export const useHandlers = <TData extends DataGridRow>(
	state: DataGridGroupPanelState<TData>,
) => {
	const handlers = useMemo(() => {
		const changeGrouping = (next: Updater<GroupingState>) => {
			const grouping = getGrouping(state);
			return state.querySetter({
				groupBy: typeof next === "function" ? next(grouping) : next,
				skip: 0,
			});
		};
		const dropAt =
			(insertIndex?: number) => (event: DragEvent<HTMLElement>) => {
				event.preventDefault();
				const columnId =
					event.dataTransfer.getData(GROUP_COLUMN_DATA_TYPE) ||
					event.dataTransfer.getData("text/plain");
				if (
					!getGroupableColumnItems(state.table.columns).some(
						(column) => column.id === columnId,
					)
				)
					return;
				void changeGrouping(
					getGroupingWithColumn(getGrouping(state), columnId, insertIndex),
				);
			};
		return {
			changeGrouping,
			dragOver: (event: DragEvent<HTMLElement>) => event.preventDefault(),
			drop: dropAt(),
			dropAt,
			dragColumn: (columnId: string) => (event: DragEvent<HTMLElement>) => {
				event.dataTransfer.effectAllowed = "move";
				event.dataTransfer.setData(GROUP_COLUMN_DATA_TYPE, columnId);
				event.dataTransfer.setData("text/plain", columnId);
			},
			addColumn: (columnId: string) => () => {
				void changeGrouping(
					getGroupingWithColumn(getGrouping(state), columnId),
				);
			},
			removeColumn: (columnId: string) => () => {
				void changeGrouping(getGrouping(state).filter((id) => id !== columnId));
			},
			moveColumn: (columnId: string, offset: -1 | 1) => () => {
				const grouping = getGrouping(state);
				const index = grouping.indexOf(columnId);
				const nextIndex = index + offset;
				if (index < 0 || nextIndex < 0 || nextIndex >= grouping.length) return;
				const next = [...grouping];
				const [column] = next.splice(index, 1);
				next.splice(nextIndex, 0, column);
				void changeGrouping(next);
			},
		};
	}, [state]);
	const grouping = getGrouping(state);
	const groupableColumns = getGroupableColumnItems(state.table.columns);
	const columnMap = new Map(
		groupableColumns.map((column) => [column.id, column]),
	);
	const activeColumns = grouping
		.map((id) => columnMap.get(id))
		.filter((column): column is DataGridGroupableColumnItem => Boolean(column));
	const activeIds = new Set(activeColumns.map((column) => column.id));
	const inactiveColumns = groupableColumns.filter(
		(column) => !activeIds.has(column.id),
	);
	const show = state.show ?? "never";
	return {
		...handlers,
		activeColumns,
		inactiveColumns,
		shouldRender:
			groupableColumns.length > 0 &&
			(show === "always" ||
				(show === "onlyWhenGrouping" && grouping.length > 0)),
	};
};
