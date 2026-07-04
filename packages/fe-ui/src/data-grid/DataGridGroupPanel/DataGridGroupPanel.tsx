"use client";

import type {
	DataGridColumnConfig,
	DataGridConfig,
	DataGridState,
} from "@cocrepo/type";
import {
	ArrowLeft,
	ArrowRight,
	GripVertical,
	Group,
	Plus,
	X,
} from "lucide-react";
import type { DragEvent } from "react";
import { Button } from "../../input/Button/Button";
import { useT } from "../../i18n";
import {
	getColumnConfigId,
	getRowGroupableColumnConfigs,
} from "../internal/columnConfig";
import { DATA_GRID_GROUP_BY_QUERY_KEY } from "../internal/grouping";
import type { Key } from "../internal/rowKeys";

type RowGroupPanelShow<T> = NonNullable<DataGridConfig<T>["rowGroupPanelShow"]>;

const GROUP_COLUMN_DATA_TYPE = "application/x-cocrepo-data-grid-column-id";

export interface DataGridGroupPanelProps<T extends { id: Key }> {
	columns: DataGridColumnConfig<T>[];
	grouping: string[];
	rowGroupPanelShow?: DataGridConfig<T>["rowGroupPanelShow"];
	state: DataGridState;
}

function shouldRenderGroupPanel<T>(
	rowGroupPanelShow: DataGridConfig<T>["rowGroupPanelShow"],
	grouping: string[],
	groupableColumns: DataGridColumnConfig<T>[],
) {
	const panelShow: RowGroupPanelShow<T> = rowGroupPanelShow ?? "never";

	if (panelShow === "never" || groupableColumns.length === 0) {
		return false;
	}
	if (panelShow === "onlyWhenGrouping") {
		return grouping.length > 0;
	}
	return true;
}

function getColumnLabel<T>(column: DataGridColumnConfig<T>) {
	return column.label;
}

function getGroupingWithColumn(
	grouping: string[],
	columnId: string,
	insertIndex = grouping.length,
) {
	const nextGrouping = grouping.filter((id) => id !== columnId);
	const nextIndex = Math.min(Math.max(insertIndex, 0), nextGrouping.length);

	return [
		...nextGrouping.slice(0, nextIndex),
		columnId,
		...nextGrouping.slice(nextIndex),
	];
}

function getMovedGrouping(
	grouping: string[],
	columnId: string,
	offset: -1 | 1,
) {
	const index = grouping.indexOf(columnId);
	const nextIndex = index + offset;

	if (index < 0 || nextIndex < 0 || nextIndex >= grouping.length) {
		return grouping;
	}

	const nextGrouping = [...grouping];
	const [column] = nextGrouping.splice(index, 1);
	nextGrouping.splice(nextIndex, 0, column);

	return nextGrouping;
}

function getDragColumnId(event: DragEvent<HTMLElement>) {
	return (
		event.dataTransfer.getData(GROUP_COLUMN_DATA_TYPE) ||
		event.dataTransfer.getData("text/plain")
	);
}

function commitGrouping(
	state: DataGridState,
	currentGrouping: string[],
	nextGrouping: string[],
) {
	void state.query.setValues({
		[DATA_GRID_GROUP_BY_QUERY_KEY]: nextGrouping,
		skip: 0,
	});

	if (state.columns.setGrouping) {
		state.columns.setGrouping(nextGrouping);
		return;
	}

	for (const columnId of currentGrouping) {
		if (!nextGrouping.includes(columnId)) {
			state.columns.setColumnGrouping?.(columnId, false);
		}
	}
	for (const columnId of nextGrouping) {
		if (!currentGrouping.includes(columnId)) {
			state.columns.setColumnGrouping?.(columnId, true);
		}
	}
}

export function DataGridGroupPanelView<T extends { id: Key }>({
	columns,
	grouping,
	rowGroupPanelShow,
	state,
}: DataGridGroupPanelProps<T>) {
	const t = useT();
	const groupableColumns = getRowGroupableColumnConfigs(columns);
	const groupableColumnMap = new Map(
		groupableColumns.map((column) => [getColumnConfigId(column), column]),
	);
	const activeColumns = grouping
		.map((columnId) => groupableColumnMap.get(columnId))
		.filter((column): column is DataGridColumnConfig<T> => Boolean(column));
	const activeColumnIds = new Set(activeColumns.map(getColumnConfigId));
	const inactiveColumns = groupableColumns.filter(
		(column) => !activeColumnIds.has(getColumnConfigId(column)),
	);
	const canChangeGrouping = true;

	if (!shouldRenderGroupPanel(rowGroupPanelShow, grouping, groupableColumns)) {
		return null;
	}

	const handleDragStart = (event: DragEvent<HTMLElement>, columnId: string) => {
		event.dataTransfer.effectAllowed = "move";
		event.dataTransfer.setData(GROUP_COLUMN_DATA_TYPE, columnId);
		event.dataTransfer.setData("text/plain", columnId);
	};
	const handleDrop = (event: DragEvent<HTMLElement>, insertIndex?: number) => {
		event.preventDefault();
		const columnId = getDragColumnId(event);

		if (!columnId || !groupableColumnMap.has(columnId)) {
			return;
		}

		commitGrouping(
			state,
			grouping,
			getGroupingWithColumn(grouping, columnId, insertIndex),
		);
	};
	const handleRemoveGroup = (columnId: string) => {
		commitGrouping(
			state,
			grouping,
			grouping.filter((groupColumnId) => groupColumnId !== columnId),
		);
	};
	const handleMoveGroup = (columnId: string, offset: -1 | 1) => {
		commitGrouping(
			state,
			grouping,
			getMovedGrouping(grouping, columnId, offset),
		);
	};

	return (
		<div className="mb-2 rounded border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-2.5 py-2 dark:border-white/15 dark:bg-neutral-900/80">
			<div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex min-w-0 flex-1 items-center gap-2">
					<Group className="size-4 shrink-0 text-muted" aria-hidden />
					<span className="shrink-0 text-xs font-semibold text-[#475569] dark:text-slate-300">
						{t("그룹")}
					</span>
					<ul
						aria-label={t("그룹 기준")}
						className="flex min-h-8 min-w-0 flex-1 list-none flex-wrap items-center gap-1.5 rounded border border-[#d6dde7] bg-white px-2 py-1 dark:border-white/10 dark:bg-neutral-950"
						onDragOver={(event) => event.preventDefault()}
						onDrop={(event) => handleDrop(event)}
					>
						{activeColumns.length > 0 ? (
							activeColumns.map((column, index) => {
								const columnId = getColumnConfigId(column);
								const label = getColumnLabel(column);

								return (
									<li
										key={columnId}
										draggable={canChangeGrouping}
										onDragStart={(event) => handleDragStart(event, columnId)}
										onDragOver={(event) => event.preventDefault()}
										onDrop={(event) => handleDrop(event, index)}
										className="inline-flex h-6 items-center gap-1 rounded border border-[#b6c2d2] bg-[#edf3fb] px-1.5 text-xs font-medium text-[#334155] shadow-sm dark:border-white/15 dark:bg-neutral-800 dark:text-slate-100"
									>
										<GripVertical className="size-3.5 text-muted" aria-hidden />
										<span>{t(label)}</span>
										<Button
											aria-label={`${label} 그룹 왼쪽으로 이동`}
											className="h-5 min-w-5 rounded px-0"
											isDisabled={index === 0}
											isIconOnly
											size="sm"
											variant="light"
											onPress={() => handleMoveGroup(columnId, -1)}
										>
											<ArrowLeft className="size-3" />
										</Button>
										<Button
											aria-label={`${label} 그룹 오른쪽으로 이동`}
											className="h-5 min-w-5 rounded px-0"
											isDisabled={index === activeColumns.length - 1}
											isIconOnly
											size="sm"
											variant="light"
											onPress={() => handleMoveGroup(columnId, 1)}
										>
											<ArrowRight className="size-3" />
										</Button>
										<Button
											aria-label={`${label} 그룹 제거`}
											className="h-5 min-w-5 rounded px-0"
											isDisabled={!canChangeGrouping}
											isIconOnly
											size="sm"
											variant="light"
											onPress={() => handleRemoveGroup(columnId)}
										>
											<X className="size-3" />
										</Button>
									</li>
								);
							})
						) : (
							<li className="text-xs text-muted">{t("그룹 없음")}</li>
						)}
					</ul>
				</div>

				{inactiveColumns.length > 0 ? (
					<div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
						{inactiveColumns.map((column) => {
							const columnId = getColumnConfigId(column);
							const label = getColumnLabel(column);

							return (
								<Button
									key={columnId}
									aria-label={`${label} 그룹 추가`}
									className="h-7 rounded px-2 text-xs"
									isDisabled={!canChangeGrouping}
									size="sm"
									startContent={<Plus className="size-3" />}
									variant="bordered"
									onPress={() =>
										commitGrouping(
											state,
											grouping,
											getGroupingWithColumn(grouping, columnId),
										)
									}
								>
									{label}
								</Button>
							);
						})}
					</div>
				) : null}
			</div>
		</div>
	);
}
