"use client";

import { FileX } from "lucide-react";
import { Typography } from "../../data-display/Typography";
import { useT } from "../../i18n";

const DATA_GRID_EMPTY_MESSAGE = "데이터가 없습니다.";

export interface DataGridEmptyRowProps {
	colSpan: number;
	emptyMessage?: string;
}

export function DataGridEmptyRow({
	colSpan,
	emptyMessage,
}: DataGridEmptyRowProps) {
	const t = useT();

	return (
		<tr>
			<td
				colSpan={Math.max(colSpan, 1)}
				className="border-b border-border px-3 py-14 text-center text-muted"
			>
				<div className="flex flex-col items-center justify-center gap-3">
					<FileX size={40} />
					<Typography
						align="center"
						color="muted"
						type="body-sm"
						weight="medium"
					>
						{t(emptyMessage ?? DATA_GRID_EMPTY_MESSAGE)}
					</Typography>
				</div>
			</td>
		</tr>
	);
}
