"use client";

import type {
	InputConfig,
	MetaDataGridState,
} from "@cocrepo/type";
import { Select, SelectItem } from "@heroui/react";
import { observer } from "mobx-react-lite";

interface SelectInputProps {
	config: InputConfig;
	state: MetaDataGridState;
}

export const SelectInput = observer(({
	config,
	state,
}: SelectInputProps) => {
	const queryKey = config.props?.queryKey ?? config.id;
	const value =
		typeof state.query.values[queryKey] === "string"
			? (state.query.values[queryKey] as string)
			: "";

	const options = config.props?.options ?? [];

	return (
		<Select
			placeholder={config.placeholder ?? config.label}
			selectedKeys={value ? [value] : []}
			onSelectionChange={(keys) => {
				const selected = Array.from(keys)[0] as string;
				void state.query.setValues({
					[queryKey]: selected || null,
					skip: 0,
				});
			}}
			classNames={{
				base: "min-w-[160px] max-w-xs",
				trigger: "h-10",
			}}
			aria-label={config.label ?? config.id}
		>
			{options.map((opt) => (
				<SelectItem key={opt.value}>{opt.label}</SelectItem>
			))}
		</Select>
	);
});
