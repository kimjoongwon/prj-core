"use client";

import type { DataGridState, InputConfig } from "@cocrepo/type";
import { ListBox } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";
import { Select } from "../../selection/Select/Select";

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

	const handleChange = (selectedValue: string | number | null) => {
		const selected = selectedValue == null ? "" : String(selectedValue);
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
			value={value || null}
			onChange={handleChange}
			isClearable={isClearable}
			onClear={isClearable ? handleClear : undefined}
			classNames={{
				base: "min-w-[160px] max-w-xs",
				trigger: "h-10",
			}}
			aria-label={config.label ? t(config.label) : config.id}
		>
			{options.map((opt) => (
				<ListBox.Item key={opt.value} id={opt.value} textValue={opt.label}>
					{t(opt.label)}
				</ListBox.Item>
			))}
		</Select>
	);
});
