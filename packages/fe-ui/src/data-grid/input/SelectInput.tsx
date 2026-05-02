"use client";

import type { DataGridState, InputConfig } from "@cocrepo/type";
import { Select, SelectItem, type Selection } from "@heroui/react";
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
	const isClearable = config.props?.isClearable === true;

	const handleSelectionChange = (keys: Selection) => {
		if (keys === "all") {
			return;
		}

		const selected = Array.from(keys)[0]?.toString() ?? "";
		void state.query.setValues({
			[queryKey]: selected || null,
			skip: 0,
		});
	};

	const handleClear = () => {
		void state.query.setValues({
			[queryKey]: null,
			skip: 0,
		});
	};

	return (
		<Select
			placeholder={
				config.placeholder
					? t(config.placeholder)
					: config.label
						? t(config.label)
						: undefined
			}
			selectedKeys={value ? [value] : []}
			onSelectionChange={handleSelectionChange}
			isClearable={isClearable}
			onClear={isClearable ? handleClear : undefined}
			classNames={{
				base: "min-w-[160px] max-w-xs",
				trigger: "h-10",
			}}
			aria-label={config.label ? t(config.label) : config.id}
		>
			{options.map((opt) => (
				<SelectItem key={opt.value}>{t(opt.label)}</SelectItem>
			))}
		</Select>
	);
});
