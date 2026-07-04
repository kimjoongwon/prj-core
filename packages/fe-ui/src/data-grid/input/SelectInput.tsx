"use client";

import type { DataGridState, InputConfig } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";

interface SelectInputProps {
	config: InputConfig;
	state: DataGridState;
}

export const SelectInput = observer(({ config, state }: SelectInputProps) => {
	const t = useT();
	const queryKey = config.props?.queryKey ?? config.id;
	const value =
		typeof state.query.values[queryKey] === "string"
			? (state.query.values[queryKey] as string)
			: "";
	const options = config.props?.options ?? [];
	const placeholder = config.placeholder ?? config.label ?? config.id;

	const handleChange = (selectedValue: string) => {
		const selected = String(selectedValue);
		void state.query.setValues({
			[queryKey]: selected || null,
			skip: 0,
		});
	};

	return (
		<select
			aria-label={config.label ? t(config.label) : config.id}
			className="h-7 w-full min-w-0 rounded-sm border border-[#cbd5e1] bg-white px-2 text-[12px] font-normal text-[#1f2937] outline-none transition-colors hover:border-[#94a3b8] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#93c5fd] dark:border-white/10 dark:bg-neutral-950/70 dark:text-slate-100 dark:hover:border-white/20 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
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
});
