"use client";

import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { Typography } from "../../data-display/Typography";
import { useT } from "../../i18n";
import type { DataGridState } from "../DataGrid";

export class DataGridActionBarState {
	constructor(readonly state: DataGridState) {
		makeAutoObservable(this, { state: false }, { autoBind: true });
	}

	get selectedCount() {
		return (
			this.state.selection?.selectedKeys?.size ??
			this.state.table.selectedKeys.size
		);
	}

	get showCount() {
		return this.state.table.selection?.actionBar?.showCount ?? true;
	}
}

export interface DataGridActionBarProps {
	state: DataGridActionBarState;
	actions?: ReactNode;
}

export const DataGridActionBar = observer(
	({ state, actions }: DataGridActionBarProps) => {
		const t = useT();
		const selectedCount = state.selectedCount;

		if (selectedCount <= 0) {
			return null;
		}

		return (
			<div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
				<div className="flex items-center gap-4 rounded-full border border-border bg-overlay px-6 py-3 shadow-overlay">
					{state.showCount ? (
						<Typography
							className="text-overlay-foreground"
							type="body-sm"
							weight="medium"
						>
							{selectedCount}
							{t("개 선택됨")}
						</Typography>
					) : null}
					<div className="h-6 w-px bg-separator" />
					<div className="flex items-center gap-2">{actions}</div>
				</div>
			</div>
		);
	},
);
