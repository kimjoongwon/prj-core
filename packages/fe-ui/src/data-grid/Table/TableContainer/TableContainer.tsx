"use client";

import type { ReactNode } from "react";

export interface TableContainerProps {
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
}: TableContainerProps) {
	const minimumTableWidth = columnWidths.reduce(
		(totalWidth, columnWidth) => totalWidth + columnWidth,
		isSelectable ? 44 : 0,
	);

	return (
		<div className="relative">
			<div className="overflow-hidden rounded border border-border bg-surface">
				<div className="overflow-x-auto">
					<table
						aria-label={ariaLabel}
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

export const TableContainer = DataGridTableRoot;
