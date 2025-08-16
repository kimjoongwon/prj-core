import {
	Select as NextSelect,
	SelectProps as NextUISelectProps,
	SelectItem,
} from "@heroui/react";
import React from "react";
import { Tool } from "@shared/utils";
import type { Option } from "../../../types";

export interface SelectProps
	extends Omit<NextUISelectProps, "children" | "onChange" | "selectedKeys"> {
	options?: Option[];
	value?: string;
	onChange?: (value: string) => void;
}

export const Select = (props: SelectProps) => {
	const { options = [], value, onChange, ...rest } = props;

	const _options = Tool.cloneDeep(options);

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
					<SelectItem key={option.key} textValue={option.value}>
						{option.label}
					</SelectItem>
				);
			})}
		</NextSelect>
	);
};
