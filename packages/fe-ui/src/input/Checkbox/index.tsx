"use client";

import { useFormField } from "@cocrepo/hook";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { Checkbox as PureCheckbox } from "./Checkbox";
import type { CheckboxProps as PureCheckboxProps } from "./Checkbox.props";

export type CheckboxProps<T extends object = object> =
	| (MobxProps<T> & Omit<PureCheckboxProps, "onChange" | "isSelected">)
	| PureCheckboxProps;

const BoundCheckbox = observer(<T extends object>(props: MobxProps<T> & Omit<PureCheckboxProps, "onChange" | "isSelected">) => {
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

const Checkbox = <T extends object>(props: CheckboxProps<T>) =>
	"state" in props && "path" in props ? <BoundCheckbox {...props} /> : <PureCheckbox {...props} />;

export type { CheckboxState } from "./Checkbox";
export { createCheckboxState } from "./Checkbox";
export { Checkbox };
