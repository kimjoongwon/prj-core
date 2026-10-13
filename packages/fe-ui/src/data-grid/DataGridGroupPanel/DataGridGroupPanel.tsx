"use client";

import type {
	DataGridGroupPanelConfig,
	DataGridSetQueryStates,
} from "@cocrepo/type";
import {
	ArrowLeft,
	ArrowRight,
	GripVertical,
	Group,
	Plus,
	X,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { Typography } from "../../data-display/Typography";
import { useT } from "../../i18n";
import { Button } from "../../input/Button/Button";
import type { DataGridQueryState, DataGridRow } from "../DataGrid";
import type { DataGridTableState } from "../DataGridTable/DataGridTable";
import { useHandlers } from "./useHandlers";

/** 그룹 패널 설정과 공유 query·Table 데이터입니다. */
export interface DataGridGroupPanelState<
	TData extends DataGridRow = DataGridRow,
> {
	show?: DataGridGroupPanelConfig["show"];
	query: DataGridQueryState;
	querySetter: DataGridSetQueryStates;
	table: DataGridTableState<TData>;
}
export interface DataGridGroupPanelProps<
	TData extends DataGridRow = DataGridRow,
> {
	state: DataGridGroupPanelState<TData>;
}

export const DataGridGroupPanel = observer(
	<TData extends DataGridRow = DataGridRow>({
		state,
	}: DataGridGroupPanelProps<TData>) => {
		const handlers = useHandlers(state);
		const t = useT();
		if (!handlers.shouldRender) return null;
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
							onDragOver={handlers.dragOver}
							onDrop={handlers.drop}
						>
							{handlers.activeColumns.length > 0 ? (
								handlers.activeColumns.map((column, index) => (
									<li
										key={column.id}
										draggable
										onDragStart={handlers.dragColumn(column.id)}
										onDragOver={handlers.dragOver}
										onDrop={handlers.dropAt(index)}
										className="inline-flex h-6 items-center gap-1 rounded border border-accent/20 bg-accent-soft px-1.5"
									>
										<GripVertical className="size-3.5 text-muted" aria-hidden />
										<Typography
											className="text-accent-soft-foreground"
											type="body-xs"
											weight="medium"
										>
											{t(column.label)}
										</Typography>
										<Button
											aria-label={`${column.label} 그룹 왼쪽으로 이동`}
											className="h-5 min-w-5 rounded px-0"
											isDisabled={index === 0}
											isIconOnly
											size="sm"
											variant="ghost"
											onPress={handlers.moveColumn(column.id, -1)}
										>
											<ArrowLeft className="size-3" />
										</Button>
										<Button
											aria-label={`${column.label} 그룹 오른쪽으로 이동`}
											className="h-5 min-w-5 rounded px-0"
											isDisabled={index === handlers.activeColumns.length - 1}
											isIconOnly
											size="sm"
											variant="ghost"
											onPress={handlers.moveColumn(column.id, 1)}
										>
											<ArrowRight className="size-3" />
										</Button>
										<Button
											aria-label={`${column.label} 그룹 제거`}
											className="h-5 min-w-5 rounded px-0"
											isIconOnly
											size="sm"
											variant="ghost"
											onPress={handlers.removeColumn(column.id)}
										>
											<X className="size-3" />
										</Button>
									</li>
								))
							) : (
								<li>
									<Typography color="muted" type="body-xs">
										{t("그룹 없음")}
									</Typography>
								</li>
							)}
						</ul>
					</div>

					{handlers.inactiveColumns.length > 0 ? (
						<div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
							{handlers.inactiveColumns.map((column) => (
								<Button
									key={column.id}
									aria-label={`${column.label} 그룹 추가`}
									className="h-7 rounded px-2 text-xs"
									size="sm"
									variant="outline"
									onPress={handlers.addColumn(column.id)}
								>
									<Plus className="size-3" aria-hidden />
									{column.label}
								</Button>
							))}
						</div>
					) : null}
				</div>
			</div>
		);
	},
);
