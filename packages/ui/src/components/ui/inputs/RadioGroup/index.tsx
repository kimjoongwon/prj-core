import { useFormField } from "@cocrepo/hook";
import { MobxProps } from "@cocrepo/type";
import { tools } from "@cocrepo/toolkit";
import { observer } from "mobx-react-lite";
import {
	RadioGroup as BaseRadioGroup,
	type RadioGroupProps as BaseRadioGroupProps,
} from "./RadioGroup";

export interface RadioGroupProps<T>
	extends MobxProps<T>,
		Omit<BaseRadioGroupProps, "value" | "onValueChange"> {}

export const RadioGroup = observer(
	<T extends object>(props: RadioGroupProps<T>) => {
		const { state, path, options, ...rest } = props;

		const value =
			options?.find((option) => option.value === tools.get(state, path))
				?.value || "";

		const formField = useFormField({ value, state, path });

		const handleValueChange = (value: string) => {
			formField.setValue(value);
		};

		return (
			<BaseRadioGroup
				{...rest}
				options={options}
				value={formField.state.value}
				onValueChange={handleValueChange}
			/>
		);
	},
);

// Re-export types for backwards compatibility
export type { BaseRadioGroupProps as PureRadioGroupProps };
export type { RadioOption } from "./RadioGroup";
