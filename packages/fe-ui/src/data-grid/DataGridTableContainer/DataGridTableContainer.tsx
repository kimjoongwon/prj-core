"use client";

import type { Table as ReactTable } from "@tanstack/react-table";
import type { ReactNode } from "react";
import type { Key } from "../DataGrid";
import type { DataGridTableState } from "../DataGridTable/DataGridTable";

export interface DataGridTableContainerProps<TData extends { id: Key }> {
	children: ReactNode;
	table: {
		state: DataGridTableState<TData>;
		instance: ReactTable<TData>;
	};
}

function DataGridTableContainerView<TData extends { id: Key }>({
	children,
	table,
}: DataGridTableContainerProps<TData>) {
	const columnWidths = table.instance
		.getVisibleLeafColumns()
		.map((column) => column.getSize());
	const isSelectable =
		table.state.selection?.mode !== undefined &&
		table.state.selection.mode !== "none";
	const minimumTableWidth = columnWidths.reduce(
		(totalWidth, columnWidth) => totalWidth + columnWidth,
		isSelectable ? 44 : 0,
	);

	return (
		<div className="relative">
			<div className="overflow-hidden rounded border border-border bg-surface">
				<div className="overflow-x-auto">
					<table
						className="w-full table-fixed border-collapse text-left"
						style={{ minWidth: minimumTableWidth }}
					>
						<colgroup>
							{isSelectable ? <col style={{ width: 44 }} /> : null}
							{columnWidths.map((width, index) => (
								<col key={index} style={{ width }} />
							))}
						</colgroup>
						{children}
					</table>
				</div>
			</div>
		</div>
	);
}

export const DataGridTableContainer = DataGridTableContainerView;
