import { get } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useFormField } from "@shared/hooks";
import { MobxProps } from "../../../types";
import {
	RadioGroup as BaseRadioGroup,
	type RadioGroupProps as BaseRadioGroupProps,
} from "./RadioGroup";

export interface RadioGroupProps<T>
	extends MobxProps<T>,
		Omit<BaseRadioGroupProps, "value" | "onValueChange"> {}

export const RadioGroup = observer(
	<T extends object>(props: RadioGroupProps<T>) => {
		const { state = {}, path = "", options, ...rest } = props;

		const initialValue =
			options?.find((option) => option.value === get(state, path))?.value || "";

		const { localState } = useFormField({ initialValue, state, path });

		const handleValueChange = action((value: string) => {
			localState.value = value;
		});

		return (
			<BaseRadioGroup
				{...rest}
				options={options}
				value={localState.value}
				onValueChange={handleValueChange}
			/>
		);
	},
);

// Re-export types for backwards compatibility
export type { BaseRadioGroupProps as PureRadioGroupProps };
export type { RadioOption } from "./RadioGroup";
