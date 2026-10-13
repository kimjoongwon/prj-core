"use client";

import { type Column, flexRender, type Header } from "@tanstack/react-table";
import { isValidElement, type ReactNode, useMemo } from "react";
import type { Translate } from "../../i18n";
import type { DataGridRow } from "../DataGrid";
import type { DataGridTableState } from "../DataGridTable/DataGridTable";

const translate: Translate = (label) => label;
const getHeaderLabel = <TData extends DataGridRow>(
	header: Header<TData, unknown>,
) => flexRender(header.column.columnDef.header, header.getContext());

/** 라벨 노드의 자식 텍스트를 모아 <th> 접근성 이름 후보를 만듭니다. */
const getHeaderTextFromNode = (node: ReactNode): string => {
	if (typeof node === "string" || typeof node === "number") {
		return String(node);
	}
	if (Array.isArray(node)) {
		return node.map((child) => getHeaderTextFromNode(child)).join(" ");
	}
	if (isValidElement<{ children?: ReactNode }>(node)) {
		return getHeaderTextFromNode(node.props.children);
	}
	return "";
};

/** 컬럼헤더 <th>의 명시적 접근성 이름(aria-label)으로 쓸 라벨 문자열을 헤더 정의에서 추출합니다. */
const getHeaderAccessibleLabel = <TData extends DataGridRow>(
	header: Header<TData, unknown>,
): string | null => {
	if (header.isPlaceholder) {
		return null;
	}
	const labelText = getHeaderTextFromNode(getHeaderLabel(header))
		.replace(/\s+/g, " ")
		.trim();
	return labelText.length > 0 ? labelText : null;
};

/** 헤더가 책임지는 정렬·선택 표시·너비 변경을 제공합니다. */
export const useHandlers = <TData extends DataGridRow>(
	state: DataGridTableState<TData>,
) => {
	const handlers = useMemo(
		() => ({
			translate,
			getHeaderLabel,
			getHeaderAccessibleLabel,
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
