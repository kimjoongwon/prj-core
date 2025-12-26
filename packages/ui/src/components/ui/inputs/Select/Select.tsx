import { cloneDeep } from "@cocrepo/toolkit";
import type { Option } from "@cocrepo/type";
import {
	Select as NextSelect,
	SelectProps as NextUISelectProps,
	SelectItem,
} from "@heroui/react";
import React from "react";

export interface SelectProps
	extends Omit<NextUISelectProps, "children" | "onChange" | "selectedKeys"> {
	options?: Option[];
	value?: string;
	onChange?: (value: string) => void;
}

export const Select = (props: SelectProps) => {
	const { options = [], value, onChange, ...rest } = props;

	const _options = cloneDeep(options);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onChange?.(e.target.value);
	};

	return (
		<NextSelect
			variant="bordered"
			{...rest}
			onChange={handleChange}
			selectedKeys={value ? [value] : undefined}
		>
			{_options.map((option) => {
				return (
					<SelectItem key={option.value} textValue={option.value}>
						{option.text}
					</SelectItem>
				);
			})}
		</NextSelect>
	);
};
