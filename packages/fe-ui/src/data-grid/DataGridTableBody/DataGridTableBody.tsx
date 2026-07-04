"use client";

import type { DataGridConfig } from "@cocrepo/type";
import { flexRender, type Row } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import type { KeyboardEvent } from "react";
import { type Translate, translateNode } from "../../i18n";
import { DataGridEmptyRow } from "../DataGridEmptyRow";
import { DataGridSelectionCell } from "../DataGridSelectionCell";
import { joinClassNames } from "../internal/classNames";
import { getColumnAlignClassName } from "../internal/columnConfig";
import { getColumnWidthStyle } from "../internal/columnSizing";
import type { DataGridBodyRow } from "../internal/grouping";
import type { Key } from "../internal/rowKeys";
import type { DataGridSelectionMode } from "../internal/selection";

const DATA_CELL_CLASS_NAME =
	"border-r border-b border-[#e1e6ef] px-3 py-0 align-middle text-[13px] text-[#1f2937] dark:border-white/10 dark:text-slate-100";
const GROUP_CELL_CLASS_NAME =
	"border-r border-b border-[#d6dde7] bg-[#f8fafc] px-0 py-0 text-[13px] text-[#1f2937] dark:border-white/10 dark:bg-neutral-800/80 dark:text-slate-100";
const CLICKABLE_ROW_CLASS_NAME =
	"cursor-pointer hover:bg-[#f3f7fb] focus-within:bg-[#f3f7fb] dark:hover:bg-white/[0.04] dark:focus-within:bg-white/[0.04]";
const DEFAULT_ROW_HOVER_CLASS_NAME =
	"hover:bg-[#f8fafc] dark:hover:bg-white/[0.03]";

export interface DataGridTableBodyProps<T extends { id: Key }> {
	config: DataGridConfig<T>;
	rows: DataGridBodyRow<T>[];
	selectedKeySet: Set<string>;
	selectionMode: DataGridSelectionMode;
	tableColumnCount: number;
	t: Translate;
	onRowSelectionChange: (rowKey: string, isSelected: boolean) => void;
}

function getRowInteractionProps<T extends { id: Key }>(
	config: DataGridConfig<T>,
	row: Row<T>,
) {
	if (!config.onRowClick) {
		return {};
	}

	return {
		onClick: () => config.onRowClick?.(row.original),
		onKeyDown: (event: KeyboardEvent<HTMLTableRowElement>) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				config.onRowClick?.(row.original);
			}
		},
		tabIndex: 0,
	};
}

function getGroupColumn<T extends { id: Key }>(row: Row<T>) {
	return row
		.getAllCells()
		.find((cell) => cell.column.id === row.groupingColumnId)?.column;
}

function getGroupLabelText<T extends { id: Key }>(row: Row<T>) {
	const label = getGroupColumn(row)?.columnDef.meta?.label;
	return typeof label === "string" ? label : (row.groupingColumnId ?? "");
}

function formatGroupValue(value: unknown, t: Translate) {
	if (value === null || value === undefined) {
		return t("빈 값");
	}

	const text = String(value);
	return text.length > 0 ? text : t("빈 값");
}

function getGroupValue<T extends { id: Key }>(row: Row<T>, t: Translate) {
	return formatGroupValue(row.groupingValue, t);
}

function DataGridGroupRow<T extends { id: Key }>({
	row,
	tableColumnCount,
	t,
}: {
	row: Row<T>;
	tableColumnCount: number;
	t: Translate;
}) {
	const groupColumn = getGroupColumn(row);
	const groupLabel = translateNode(
		groupColumn?.columnDef.meta?.label ?? row.groupingColumnId ?? "",
		t,
	);
	const groupLabelText = getGroupLabelText(row);
	const groupValue = getGroupValue(row, t);
	const leafRowCount = row.getLeafRows().length;

	return (
		<tr key={row.id}>
			<td colSpan={tableColumnCount} className={GROUP_CELL_CLASS_NAME}>
				<button
					type="button"
					aria-expanded={row.getIsExpanded()}
					aria-label={`${groupLabelText} ${groupValue} 그룹 ${
						row.getIsExpanded() ? "접기" : "펼치기"
					}`}
					className="flex h-10 w-full items-center gap-2 px-3 text-left font-medium hover:bg-[#eef3f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93c5fd] dark:hover:bg-white/[0.05]"
					onClick={row.getToggleExpandedHandler()}
					style={{ paddingLeft: `${12 + row.depth * 18}px` }}
				>
					<ChevronRight
						className={joinClassNames(
							"size-4 shrink-0 text-[#64748b] transition-transform dark:text-slate-400",
							row.getIsExpanded() && "rotate-90",
						)}
					/>
					<span className="text-[#334155] dark:text-slate-100">
						{groupLabel}
					</span>
					<span className="text-[#0f172a] dark:text-white">{groupValue}</span>
					<span className="text-xs font-normal text-[#64748b] dark:text-slate-400">
						({leafRowCount})
					</span>
				</button>
			</td>
		</tr>
	);
}

export function DataGridTableBodyView<T extends { id: Key }>({
	config,
	rows,
	selectedKeySet,
	selectionMode,
	tableColumnCount,
	t,
	onRowSelectionChange,
}: DataGridTableBodyProps<T>) {
	return (
		<tbody>
			{rows.length === 0 ? (
				<DataGridEmptyRow
					colSpan={tableColumnCount}
					emptyMessage={config.emptyMessage}
				/>
			) : (
				rows.map((row) => {
					const isSelected = selectedKeySet.has(row.id);

					if (row.getIsGrouped()) {
						return (
							<DataGridGroupRow
								key={row.id}
								row={row}
								tableColumnCount={tableColumnCount}
								t={t}
							/>
						);
					}

					return (
						<tr
							key={row.id}
							aria-selected={selectionMode ? isSelected : undefined}
							className={joinClassNames(
								"h-10 transition-colors",
								isSelected && "bg-[#eef6ff] dark:bg-sky-500/15",
								config.onRowClick
									? CLICKABLE_ROW_CLASS_NAME
									: DEFAULT_ROW_HOVER_CLASS_NAME,
							)}
							{...getRowInteractionProps(config, row)}
						>
							{selectionMode ? (
								<DataGridSelectionCell
									entity={config.entity}
									isSelected={isSelected}
									rowKey={row.id}
									selectionMode={selectionMode}
									onSelectionChange={onRowSelectionChange}
								/>
							) : null}
							{row.getVisibleCells().map((cell) => {
								const alignClassName = getColumnAlignClassName(
									cell.column.columnDef,
								);

								return (
									<td
										key={cell.id}
										className={joinClassNames(
											DATA_CELL_CLASS_NAME,
											alignClassName,
										)}
										style={getColumnWidthStyle(cell.column.columnDef)}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								);
							})}
						</tr>
					);
				})
			)}
		</tbody>
	);
}
