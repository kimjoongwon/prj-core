"use client";

import { DataGridTableBody } from "./DataGridTableBody";
import { DataGridTableHeader } from "./DataGridTableHeader";
import type { ReactNode } from "react";

export interface DataGridTableProps {
	children: ReactNode;
	columnWidths: number[];
	isSelectable?: boolean;
	ariaLabel: string;
}

function DataGridTableRoot({
	children,
	columnWidths,
	isSelectable = false,
	ariaLabel,
}: DataGridTableProps) {
	return (
		<div className="relative">
			<div className="overflow-hidden rounded border border-[#d6dde7] bg-surface dark:border-white/10 dark:bg-neutral-900">
				<div className="overflow-x-auto">
					<table
						aria-label={ariaLabel}
						className="min-w-full table-fixed border-collapse text-left"
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

export const DataGridTable = Object.assign(DataGridTableRoot, {
	Header: DataGridTableHeader,
	Body: DataGridTableBody,
});
