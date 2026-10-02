"use client";

import type { DataGridQueryStates, InputConfig } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";

interface DateRangeInputProps {
	config: InputConfig;
	queryValues: DataGridQueryStates;
	onQueryChange: (values: Record<string, unknown | null>) => void;
}

function getQueryValue(value: unknown) {
	return typeof value === "string" ? value : "";
}

export const DateRangeInput = observer(
	({ config, queryValues, onQueryChange }: DateRangeInputProps) => {
		const t = useT();
		const startKey = config.props?.queryKeys?.start ?? `${config.id}Start`;
		const endKey = config.props?.queryKeys?.end ?? `${config.id}End`;
		const startValue = getQueryValue(queryValues[startKey]);
		const endValue = getQueryValue(queryValues[endKey]);

		const handleChange = (key: string, value: string | number) => {
			const nextValue = String(value);
			void onQueryChange({
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
					className="h-7 min-w-0 flex-1 rounded-sm border border-field-border bg-field px-2 text-[12px] font-normal text-field-foreground outline-none transition-colors hover:border-field-border-hover focus:border-field-border-focus focus-field-ring"
					type="date"
					value={startValue}
					onChange={(event) =>
						handleChange(startKey, event.currentTarget.value)
					}
				/>
				<span className="text-[12px] text-muted">-</span>
				<input
					aria-label={
						config.label ? `${t(config.label)} ${t("종료일")}` : t("종료일")
					}
					className="h-7 min-w-0 flex-1 rounded-sm border border-field-border bg-field px-2 text-[12px] font-normal text-field-foreground outline-none transition-colors hover:border-field-border-hover focus:border-field-border-focus focus-field-ring"
					type="date"
					value={endValue}
					onChange={(event) => handleChange(endKey, event.currentTarget.value)}
				/>
			</div>
		);
	},
);
