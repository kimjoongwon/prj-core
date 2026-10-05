"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { ReactNode } from "react";
import { translateNode, useT } from "../../../i18n";
import { Button } from "../../../input/Button/Button";
import type { DataGridSortDirection } from "../../state/sorting";

export interface ColumnSortInputProps {
	label: ReactNode;
	sortDirection: DataGridSortDirection;
	onToggle: () => void;
}

export function ColumnSortInput({
	label,
	sortDirection,
	onToggle,
}: ColumnSortInputProps) {
	const t = useT();
	const iconClassName = "size-3.5 text-muted";
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
			className="h-auto min-h-0 min-w-0 justify-start gap-1 rounded px-0 py-0 text-[13px] font-semibold text-foreground hover:bg-transparent"
			onPress={onToggle}
			aria-label={t("정렬 변경")}
		>
			{translateNode(label, t)}
			{icon}
		</Button>
	);
}
