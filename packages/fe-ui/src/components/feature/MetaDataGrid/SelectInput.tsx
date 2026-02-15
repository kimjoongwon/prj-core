"use client";

import type { InputConfig } from "@cocrepo/type";
import { Select, SelectItem } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { parseAsString, useQueryState } from "nuqs";

interface SelectInputProps {
	config: InputConfig;
}

export const SelectInput = observer(({ config }: SelectInputProps) => {
	const queryKey = config.props?.queryKey ?? config.id;
	const [value, setValue] = useQueryState(queryKey, parseAsString);

	const options = config.props?.options ?? [];

	return (
		<Select
			placeholder={config.placeholder ?? config.label}
			selectedKeys={value ? [value] : []}
			onSelectionChange={(keys) => {
				const selected = Array.from(keys)[0] as string;
				setValue(selected || null);
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
