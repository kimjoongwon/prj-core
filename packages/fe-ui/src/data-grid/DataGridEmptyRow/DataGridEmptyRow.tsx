"use client";

import { FileX } from "lucide-react";
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
				className="border-b border-[#e1e6ef] px-3 py-14 text-center text-muted dark:border-white/10"
			>
				<div className="flex flex-col items-center justify-center gap-3">
					<FileX size={40} />
					<p className="text-sm font-medium">
						{t(emptyMessage ?? DATA_GRID_EMPTY_MESSAGE)}
					</p>
				</div>
			</td>
		</tr>
	);
}
