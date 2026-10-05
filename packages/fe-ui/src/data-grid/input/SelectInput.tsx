"use client";

import type { DataGridQueryStates, InputConfig } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";

interface SelectInputProps {
	config: InputConfig;
	queryValues: DataGridQueryStates;
	onQueryChange: (values: Record<string, unknown | null>) => void;
}

export const SelectInput = observer(
	({ config, queryValues, onQueryChange }: SelectInputProps) => {
		const t = useT();
		const queryKey = config.props?.queryKey ?? config.id;
		const value =
			typeof queryValues[queryKey] === "string"
				? (queryValues[queryKey] as string)
				: "";
		const options = config.props?.options ?? [];
		const placeholder = config.placeholder ?? config.label ?? config.id;

		const handleChange = (selectedValue: string) => {
			const selected = String(selectedValue);
			void onQueryChange({
				[queryKey]: selected || null,
				skip: 0,
			});
		};

		return (
			<select
				aria-label={config.label ? t(config.label) : config.id}
				className="h-7 w-full min-w-0 rounded-sm border border-field-border bg-field px-2 text-[12px] font-normal text-field-foreground outline-none transition-colors hover:border-field-border-hover focus:border-field-border-focus focus-field-ring"
				onChange={(event) => handleChange(event.currentTarget.value)}
				value={value}
			>
				<option value="">{t(placeholder)}</option>
				{options.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{t(opt.label)}
					</option>
				))}
			</select>
		);
	},
);
