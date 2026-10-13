"use client";

import type { DataGridQueryState, InputConfig } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { useT } from "../../../i18n";
import { useHandlers } from "./useHandlers";

export interface SelectInputProps {
	config: InputConfig;
	queryValues: DataGridQueryState;
	onQueryChange: (values: Record<string, unknown | null>) => void;
}

export const SelectInput = observer((state: SelectInputProps) => {
	const { config } = state;
	const t = useT();
	const handlers = useHandlers(state);
	const options = config.props?.options ?? [];
	const placeholder = config.placeholder ?? config.label ?? config.id;

	return (
		<select
			aria-label={config.label ? t(config.label) : config.id}
			className="h-7 w-full min-w-0 rounded-sm border border-field-border bg-field px-2 text-[12px] font-normal text-field-foreground outline-none transition-colors hover:border-field-border-hover focus:border-field-border-focus focus-field-ring"
			onChange={handlers.changeSelection}
			value={handlers.selectedValue}
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
