"use client";

import type { ReactNode } from "react";
import { useT } from "../../i18n";
import type { Key } from "../internal/rowKeys";

export interface DataGridActionBarProps<T extends { id: Key }> {
	showCount?: boolean;
	selectedCount: number;
	actions?: ReactNode;
}

export function DataGridActionBarView<T extends { id: Key }>({
	showCount = true,
	selectedCount,
	actions,
}: DataGridActionBarProps<T>) {
	const t = useT();

	if (selectedCount <= 0) {
		return null;
	}

	return (
		<div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
			<div className="flex items-center gap-4 rounded-full border border-border bg-surface-secondary px-6 py-3 shadow-lg">
				{showCount ? (
					<span className="text-sm font-medium text-foreground">
						{selectedCount}
						{t("개 선택됨")}
					</span>
				) : null}
				<div className="h-6 w-px bg-border" />
				<div className="flex items-center gap-2">{actions}</div>
			</div>
		</div>
	);
}
