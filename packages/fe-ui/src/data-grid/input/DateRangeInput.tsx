"use client";

import type { DataGridState, InputConfig } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";

interface DateRangeInputProps {
	config: InputConfig;
	state: DataGridState;
}

function getQueryValue(value: unknown) {
	return typeof value === "string" ? value : "";
}

export const DateRangeInput = observer(
	({ config, state }: DateRangeInputProps) => {
		const t = useT();
		const startKey = config.props?.queryKeys?.start ?? `${config.id}Start`;
		const endKey = config.props?.queryKeys?.end ?? `${config.id}End`;
		const startValue = getQueryValue(state.query.values[startKey]);
		const endValue = getQueryValue(state.query.values[endKey]);

		const handleChange = (key: string, value: string | number) => {
			const nextValue = String(value);
			void state.query.setValues({
				[key]: nextValue.length > 0 ? nextValue : null,
				skip: 0,
			});
		};

		return (
			<div className="flex min-w-0 items-center gap-1">
				<input
					aria-label={
						config.label ? `${t(config.label)} ${t("시작일")}` : t("시작일")
					}
					className="h-7 min-w-0 flex-1 rounded-sm border border-[#cbd5e1] bg-white px-2 text-[12px] font-normal text-[#1f2937] outline-none transition-colors hover:border-[#94a3b8] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#93c5fd] dark:border-white/10 dark:bg-neutral-950/70 dark:text-slate-100 dark:hover:border-white/20 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
					type="date"
					value={startValue}
					onChange={(event) =>
						handleChange(startKey, event.currentTarget.value)
					}
				/>
				<span className="text-[12px] text-[#64748b] dark:text-slate-400">
					-
				</span>
				<input
					aria-label={
						config.label ? `${t(config.label)} ${t("종료일")}` : t("종료일")
					}
					className="h-7 min-w-0 flex-1 rounded-sm border border-[#cbd5e1] bg-white px-2 text-[12px] font-normal text-[#1f2937] outline-none transition-colors hover:border-[#94a3b8] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#93c5fd] dark:border-white/10 dark:bg-neutral-950/70 dark:text-slate-100 dark:hover:border-white/20 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
					type="date"
					value={endValue}
					onChange={(event) => handleChange(endKey, event.currentTarget.value)}
				/>
			</div>
		);
	},
);
