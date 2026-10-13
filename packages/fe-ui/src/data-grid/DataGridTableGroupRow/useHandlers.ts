"use client";

import { type Translate, translateNode } from "../../i18n";
import type { DataGridTableGroupRowProps } from "./DataGridTableGroupRow";

const translateGroupText: Translate = (groupText) => groupText;

export function useHandlers<T>(state: DataGridTableGroupRowProps<T>) {
	return {
		getGroupPresentation: () => {
			const row = state.row;
			const groupColumn = row
				.getAllCells()
				.find((cell) => cell.column.id === row.groupingColumnId)?.column;
			const label = groupColumn?.columnDef.meta?.label;
			const groupLabel = translateNode(
				label ?? row.groupingColumnId ?? "",
				translateGroupText,
			);
			const groupLabelText =
				typeof label === "string" ? label : (row.groupingColumnId ?? "");
			const groupValue =
				state.row.groupingValue == null ||
				String(state.row.groupingValue) === ""
					? translateGroupText("빈 값")
					: String(state.row.groupingValue);
			return { groupLabel, groupLabelText, groupValue };
		},
	};
}
