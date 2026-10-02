"use client";

import type { ReactNode } from "react";
import { useT } from "../../i18n";
import type { DataGridActionBarState } from "../state/DataGridActionBarState";

export interface DataGridActionBarProps {
	state: DataGridActionBarState;
	showCount?: boolean;
	actions?: ReactNode;
}

export function DataGridActionBarView({
	state,
	showCount = true,
	actions,
}: DataGridActionBarProps) {
	const t = useT();
	const selectedCount = state.selectedCount;

	if (selectedCount <= 0) {
		return null;
	}

	return (
		<div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
			<div className="flex items-center gap-4 rounded-full border border-border bg-overlay px-6 py-3 shadow-overlay">
				{showCount ? (
					<span className="text-sm font-medium text-overlay-foreground">
						{selectedCount}
						{t("개 선택됨")}
					</span>
				) : null}
				<div className="h-6 w-px bg-separator" />
				<div className="flex items-center gap-2">{actions}</div>
			</div>
		</div>
	);
}
