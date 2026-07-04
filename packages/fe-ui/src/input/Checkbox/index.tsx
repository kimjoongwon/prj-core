"use client";

import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { Checkbox as PureCheckbox } from "./Checkbox";
import type { CheckboxProps as PureCheckboxProps } from "./Checkbox.props";

export interface CheckboxProps<T>
	extends MobxProps<T>,
		Omit<PureCheckboxProps, "onChange" | "isSelected"> {}

const Checkbox = observer(<T extends object>(props: CheckboxProps<T>) => {
	const { path, state, ...rest } = props;

	const formField = useFormField<T, boolean>({
		value: tools.get(state, path, false) as boolean,
		state,
		path,
	});

	const handleChange = (checked: boolean) => {
		formField.setValue(checked);
	};

	return (
		<PureCheckbox
			{...rest}
			isSelected={formField.state.value as boolean}
			onChange={handleChange}
		/>
	);
});

export { Checkbox };
