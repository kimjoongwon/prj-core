"use client";

import { type Column, flexRender, type Header } from "@tanstack/react-table";
import { useMemo } from "react";
import type { Translate } from "../../i18n";
import type { DataGridRow } from "../DataGrid";
import type { DataGridTableState } from "../DataGridTable/DataGridTable";

const translate: Translate = (label) => label;
const getHeaderLabel = <TData extends DataGridRow>(
	header: Header<TData, unknown>,
) => flexRender(header.column.columnDef.header, header.getContext());

/** 헤더가 책임지는 정렬·선택 표시·너비 변경을 제공합니다. */
export const useHandlers = <TData extends DataGridRow>(
	state: DataGridTableState<TData>,
) => {
	const handlers = useMemo(
		() => ({
			translate,
			getHeaderLabel,
			toggleSorting: (column: Column<TData, unknown>) => () =>
				column.toggleSorting(),
			selectionCheckboxRef: (input: HTMLInputElement | null) => {
				if (!input) return;
				const table = state.instance;
				input.indeterminate = Boolean(
					table &&
						!table.getIsAllRowsSelected() &&
						table.getIsSomeRowsSelected(),
				);
			},
			changeColumnSizing: (columnId: string, size: number | null) => {
				const table = state.instance;
				if (!table) return;
				if (size == null) {
					table.getColumn(columnId)?.resetSize();
					return;
				}
				table.setColumnSizing((sizing) => ({ ...sizing, [columnId]: size }));
			},
		}),
		[state],
	);
	const selectionMode =
		state.selection?.mode === "none" ? undefined : state.selection?.mode;
	const table = state.instance;
	const isAllRowsSelected = Boolean(table?.getIsAllRowsSelected());
	const isSomeRowsSelected = Boolean(table?.getIsSomeRowsSelected());
	const selectionAriaChecked: boolean | "mixed" = isAllRowsSelected
		? true
		: isSomeRowsSelected
			? "mixed"
			: false;
	return {
		...handlers,
		selectionMode,
		isAllRowsSelected,
		selectionAriaChecked,
	};
};
