"use client";

import type { DataGridQueryState, InputConfig } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { Typography } from "../../../data-display/Typography";
import { useT } from "../../../i18n";
import { useHandlers } from "./useHandlers";

export interface DateRangeInputProps {
	config: InputConfig;
	queryValues: DataGridQueryState;
	onQueryChange: (values: Record<string, unknown | null>) => void;
}

export const DateRangeInput = observer((state: DateRangeInputProps) => {
	const { config } = state;
	const t = useT();
	const handlers = useHandlers(state);

	return (
		<div className="flex min-w-0 items-center gap-1">
			<input
				aria-label={
					config.label ? `${t(config.label)} ${t("시작일")}` : t("시작일")
				}
				className="h-7 min-w-0 flex-1 rounded-sm border border-field-border bg-field px-2 text-[12px] font-normal text-field-foreground outline-none transition-colors hover:border-field-border-hover focus:border-field-border-focus focus-field-ring"
				type="date"
				value={handlers.startValue}
				onChange={handlers.changeStartDate}
			/>
			<Typography color="muted" type="body-xs">
				-
			</Typography>
			<input
				aria-label={
					config.label ? `${t(config.label)} ${t("종료일")}` : t("종료일")
				}
				className="h-7 min-w-0 flex-1 rounded-sm border border-field-border bg-field px-2 text-[12px] font-normal text-field-foreground outline-none transition-colors hover:border-field-border-hover focus:border-field-border-focus focus-field-ring"
				type="date"
				value={handlers.endValue}
				onChange={handlers.changeEndDate}
			/>
		</div>
	);
});
