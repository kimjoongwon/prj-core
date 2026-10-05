"use client";

import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import type { Key } from "react-aria-components";
import {
	Select as PureSelect,
	type SelectProps as PureSelectProps,
} from "./Select";

export interface SelectProps<T>
	extends MobxProps<T>,
		Omit<PureSelectProps, "value" | "onChange" | "options"> {
	options?: PureSelectProps["options"];
}

const Select = observer(<T extends object>(props: SelectProps<T>) => {
	const { state, path, options = [], ...rest } = props;

	const _options = tools.clone(options);

	const value = (_options as Array<{ value: string }>)?.find(
		(option) => option.value === tools.get(state, path),
	)?.value;

	const formField = useFormField({ value, state, path });

	const handleChange = (value: Key | null) => {
		formField.setValue(value == null ? "" : String(value));
	};

	return (
		<PureSelect
			{...rest}
			options={options}
			value={formField.state.value}
			onChange={handleChange}
		/>
	);
});

export { Select };
export type { PureSelectProps };
