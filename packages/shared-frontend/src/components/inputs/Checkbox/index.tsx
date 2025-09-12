import { useFormField } from "@shared/hooks";
import { MobxProps } from "@shared/types";
import { tools } from "@shared/utils";
import { action } from "mobx";
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

		const { localState } = useFormField({
			initialValue: tools.get(state, path, false),
			state,
			path,
		});

		const handleChange = action((checked: boolean) => {
			localState.value = checked;
		});

		return (
			<BaseCheckbox
				{...rest}
				isSelected={localState.value}
				onChange={handleChange}
			/>
		);
	},
);

// Re-export types for backwards compatibility
export type { BaseCheckboxProps as PureCheckboxProps };
