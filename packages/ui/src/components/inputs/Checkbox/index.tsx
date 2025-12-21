import { useFormField } from "@cocrepo/hook";
import { MobxProps } from "@cocrepo/type";
import { tools } from "@cocrepo/toolkit";
import { observer } from "mobx-react-lite";
import {
	Checkbox as BaseCheckbox,
	type CheckboxProps as BaseCheckboxProps,
} from "./Checkbox";

export interface CheckboxProps<T>
	extends MobxProps<T>,
		Omit<BaseCheckboxProps, "onChange" | "isSelected"> {}

export const Checkbox = observer(
	<T extends object>(props: CheckboxProps<T>) => {
		const { path, state, ...rest } = props;

		const formField = useFormField({
			value: tools.get(state, path, false),
			state,
			path,
		});

		const handleChange = (checked: boolean) => {
			formField.setValue(checked);
		};

		return (
			<BaseCheckbox
				{...rest}
				isSelected={formField.state.value}
				onChange={handleChange}
			/>
		);
	},
);

// Re-export types for backwards compatibility
export type { BaseCheckboxProps as PureCheckboxProps };
