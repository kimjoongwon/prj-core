"use client";

import { type Row } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { Typography } from "../../data-display/Typography";
import type { Key } from "../DataGrid";
import { useHandlers } from "./useHandlers";

const GROUP_CELL_CLASS_NAME =
	"border-r border-b border-border bg-surface-secondary px-0 py-0 text-[13px] text-foreground";

/** TanStack의 그룹 행을 펼침 동작과 그룹 요약으로 렌더링합니다. */
export interface DataGridTableGroupRowProps<T> {
	row: Row<T>;
	columnCount: number;
}

export function DataGridTableGroupRow<T extends { id: Key }>(
	state: DataGridTableGroupRowProps<T>,
) {
	const { row, columnCount } = state;
	const handlers = useHandlers(state);
	const { groupLabel, groupLabelText, groupValue } =
		handlers.getGroupPresentation();
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
