"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../../input/Button/Button";
import { translateNode, useT } from "../../i18n";
import type { DataGridSortDirection } from "../internal/sorting";

export interface DataGridSortHeaderProps {
	label: ReactNode;
	sortDirection: DataGridSortDirection;
	onToggle: () => void;
}

export function DataGridSortHeaderView({
	label,
	sortDirection,
	onToggle,
}: DataGridSortHeaderProps) {
	const t = useT();
	const iconClassName = "size-3.5 text-[#64748b] dark:text-slate-400";
	const icon =
		sortDirection === "asc" ? (
			<ArrowUp className={iconClassName} />
		) : sortDirection === "desc" ? (
			<ArrowDown className={iconClassName} />
		) : (
			<ArrowUpDown className={iconClassName} />
		);

	return (
		<Button
			size="sm"
			variant="ghost"
			className="h-auto min-h-0 min-w-0 justify-start gap-1 rounded px-0 py-0 text-[13px] font-semibold text-[#374151] hover:bg-transparent dark:text-slate-200"
			endContent={icon}
			onPress={onToggle}
			aria-label={t("정렬 변경")}
		>
			{translateNode(label, t)}
		</Button>
	);
}
