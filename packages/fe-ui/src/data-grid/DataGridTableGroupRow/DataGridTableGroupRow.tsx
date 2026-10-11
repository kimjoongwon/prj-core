"use client";

import { type Row } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { Typography } from "../../data-display/Typography";
import { type Translate, translateNode } from "../../i18n";
import type { Key } from "../DataGrid";

const GROUP_CELL_CLASS_NAME =
	"border-r border-b border-border bg-surface-secondary px-0 py-0 text-[13px] text-foreground";

function getGroupColumn<T extends { id: Key }>(row: Row<T>) {
	return row
		.getAllCells()
		.find((cell) => cell.column.id === row.groupingColumnId)?.column;
}

function getGroupLabelText<T extends { id: Key }>(row: Row<T>) {
	const label = getGroupColumn(row)?.columnDef.meta?.label;
	return typeof label === "string" ? label : (row.groupingColumnId ?? "");
}

function formatGroupValue(value: unknown, translate: Translate) {
	if (value === null || value === undefined) return translate("빈 값");
	const text = String(value);
	return text.length > 0 ? text : translate("빈 값");
}

/** TanStack의 그룹 행을 펼침 동작과 그룹 요약으로 렌더링합니다. */
export function DataGridTableGroupRow<T extends { id: Key }>({
	row,
	columnCount,
}: {
	row: Row<T>;
	columnCount: number;
}) {
	const translate: Translate = (value) => value;
	const groupColumn = getGroupColumn(row);
	const groupLabel = translateNode(
		groupColumn?.columnDef.meta?.label ?? row.groupingColumnId ?? "",
		translate,
	);
	const groupLabelText = getGroupLabelText(row);
	const groupValue = formatGroupValue(row.groupingValue, translate);
	const leafRowCount = row.getLeafRows().length;

	return (
		<tr>
			<td colSpan={columnCount} className={GROUP_CELL_CLASS_NAME}>
				<button
					type="button"
					aria-expanded={row.getIsExpanded()}
					aria-label={`${groupLabelText} ${groupValue} 그룹 ${row.getIsExpanded() ? "접기" : "펼치기"}`}
					className="flex h-10 w-full items-center gap-2 px-3 text-left font-medium hover:bg-surface-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/40"
					onClick={row.getToggleExpandedHandler()}
					style={{ paddingLeft: `${12 + row.depth * 18}px` }}
				>
					<ChevronRight
						className={[
							"size-4 shrink-0 text-muted transition-transform",
							row.getIsExpanded() && "rotate-90",
						]
							.filter(Boolean)
							.join(" ")}
					/>
					<Typography className="text-[13px]" type="body-sm" weight="medium">
						{groupLabel}
					</Typography>
					<Typography className="text-[13px]" type="body-sm" weight="medium">
						{groupValue}
					</Typography>
					<Typography color="muted" type="body-xs" weight="normal">
						({leafRowCount})
					</Typography>
				</button>
			</td>
		</tr>
	);
}
