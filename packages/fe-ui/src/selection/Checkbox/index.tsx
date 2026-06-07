import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { Checkbox as BaseCheckbox } from "./Checkbox";
import type { CheckboxProps as BaseCheckboxProps } from "./Checkbox.props";

export interface CheckboxProps<T>
	extends MobxProps<T>,
		Omit<BaseCheckboxProps, "onChange" | "isSelected"> {}

export const Checkbox = observer(
	<T extends object>(props: CheckboxProps<T>) => {
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
			<BaseCheckbox
				{...rest}
				isSelected={formField.state.value as boolean}
				onChange={handleChange}
			/>
		);
	},
);
