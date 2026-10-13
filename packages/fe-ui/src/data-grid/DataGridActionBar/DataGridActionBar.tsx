"use client";

import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { Typography } from "../../data-display/Typography";
import { useT } from "../../i18n";
import type { DataGridRow } from "../DataGrid";
import type { DataGridTableState } from "../DataGridTable/DataGridTable";
import { useHandlers } from "./useHandlers";

/** 액션바가 표시하는 설정과 선택 원본의 공유 참조입니다. */
export interface DataGridActionBarState<
	TData extends DataGridRow = DataGridRow,
> {
	table: DataGridTableState<TData>;
	showCount: boolean;
	actions?: ReactNode;
}

export interface DataGridActionBarProps<
	TData extends DataGridRow = DataGridRow,
> {
	state: DataGridActionBarState<TData>;
}

export const DataGridActionBar = observer(
	<TData extends DataGridRow = DataGridRow>({
		state,
	}: DataGridActionBarProps<TData>) => {
		const t = useT();
		const handlers = useHandlers(state);
		if (handlers.selectedCount <= 0) return null;
		return (
			<div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
				<div className="flex items-center gap-4 rounded-full border border-border bg-overlay px-6 py-3 shadow-overlay">
					{handlers.showCount ? (
						<Typography
							className="text-overlay-foreground"
							type="body-sm"
							weight="medium"
						>
							{handlers.selectedCount}
							{t("개 선택됨")}
						</Typography>
					) : null}
					<div className="h-6 w-px bg-separator" />
					<div className="flex items-center gap-2">{state.actions}</div>
				</div>
			</div>
		);
	},
);
