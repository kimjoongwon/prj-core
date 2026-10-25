"use client";

import { useFormField } from "@cocrepo/hook";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { Checkbox as PureCheckbox } from "./Checkbox";
import type { CheckboxProps as PureCheckboxProps } from "./Checkbox.props";

export type CheckboxProps<T extends object = object> =
	| (MobxProps<T> & Omit<PureCheckboxProps, "onChange" | "isSelected">)
	| PureCheckboxProps;

const Checkbox = observer(<T extends object>(props: CheckboxProps<T>) => {
	if (!("state" in props && "path" in props))
		return <PureCheckbox {...props} />;
	const { path, state, ...rest } = props;

	const formField = useFormField<T, boolean>({
		defaultValue: false,
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

export type { CheckboxState } from "./Checkbox";
export { createCheckboxState } from "./Checkbox";
export { Checkbox };
