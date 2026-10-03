"use client";

import type {
	DataGridColumnConfig,
	DataGridGroupPanelConfig,
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
import { Typography } from "../../data-display/Typography";
import { useT } from "../../i18n";
import { Button } from "../../input/Button/Button";
import {
	getColumnConfigId,
	getRowGroupableColumnConfigs,
} from "../columns/columnConfig";
import type { DataGridGroupPanelState } from "../state/DataGridGroupPanelState";
import type { Key } from "../Table/rowKeys";

type RowGroupPanelShow = NonNullable<DataGridGroupPanelConfig["show"]>;

const GROUP_COLUMN_DATA_TYPE = "application/x-cocrepo-data-grid-column-id";

export interface DataGridGroupPanelProps<T extends { id: Key }> {
	state: DataGridGroupPanelState;
	config?: DataGridGroupPanelConfig;
	columns: DataGridColumnConfig<T>[];
}

function shouldRenderGroupPanel<T>(
	rowGroupPanelShow: DataGridGroupPanelConfig["show"],
	grouping: string[],
	groupableColumns: DataGridColumnConfig<T>[],
) {
	const panelShow: RowGroupPanelShow = rowGroupPanelShow ?? "never";

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

export function DataGridGroupPanelView<T extends { id: Key }>({
	state,
	config,
	columns,
}: DataGridGroupPanelProps<T>) {
	const grouping = state.getGrouping(columns);
	const rowGroupPanelShow = config?.show;
	const onGroupingChange = state.changeGrouping;
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

		onGroupingChange(getGroupingWithColumn(grouping, columnId, insertIndex));
	};
	const handleRemoveGroup = (columnId: string) => {
		onGroupingChange(
			grouping.filter((groupColumnId) => groupColumnId !== columnId),
		);
	};
	const handleMoveGroup = (columnId: string, offset: -1 | 1) => {
		onGroupingChange(getMovedGrouping(grouping, columnId, offset));
	};

	return (
		<div className="mb-2 rounded border border-dashed border-border bg-surface-secondary px-2.5 py-2">
			<div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex min-w-0 flex-1 items-center gap-2">
					<Group className="size-4 shrink-0 text-muted" aria-hidden />
					<Typography className="shrink-0" type="body-xs" weight="semibold">
						{t("그룹")}
					</Typography>
					<ul
						aria-label={t("그룹 기준")}
						className="flex min-h-8 min-w-0 flex-1 list-none flex-wrap items-center gap-1.5 rounded border border-border bg-surface px-2 py-1"
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
										className="inline-flex h-6 items-center gap-1 rounded border border-accent/20 bg-accent-soft px-1.5"
									>
										<GripVertical className="size-3.5 text-muted" aria-hidden />
										<Typography
											className="text-accent-soft-foreground"
											type="body-xs"
											weight="medium"
										>
											{t(label)}
										</Typography>
										<Button
											aria-label={`${label} 그룹 왼쪽으로 이동`}
											className="h-5 min-w-5 rounded px-0"
											isDisabled={index === 0}
											isIconOnly
											size="sm"
											variant="ghost"
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
											variant="ghost"
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
											variant="ghost"
											onPress={() => handleRemoveGroup(columnId)}
										>
											<X className="size-3" />
										</Button>
									</li>
								);
							})
						) : (
							<li>
								<Typography color="muted" type="body-xs">
									{t("그룹 없음")}
								</Typography>
							</li>
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
									variant="outline"
									onPress={() =>
										onGroupingChange(getGroupingWithColumn(grouping, columnId))
									}
								>
									<Plus className="size-3" aria-hidden />
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
