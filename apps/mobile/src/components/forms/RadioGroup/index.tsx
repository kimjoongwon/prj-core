import { useFormField } from "@shared/hooks";
import { MobxProps } from "@shared/types";
import { get } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import {
	RadioGroupProps as BaseRadioGroupProps,
	MobxRadioGroupProps,
	RadioGroupColor,
	RadioGroup as RadioGroupComponent,
	RadioGroupOrientation,
	RadioGroupRef,
	RadioGroupSize,
} from "./RadioGroup";

export interface RadioGroupProps<T, D = any>
	extends MobxProps<T>,
		Omit<BaseRadioGroupProps<D>, "value" | "onValueChange"> {}

export const RadioGroup = observer(
	<T extends object, D = any>(props: RadioGroupProps<T, D>) => {
		const { state, path, ...rest } = props;

		const initialValue = get(state, path);

		const { localState } = useFormField({
			initialValue,
			state,
			path,
		});

		const handleValueChange = action((value: any) => {
			localState.value = value;
		});

		return (
			<RadioGroupComponent
				{...rest}
				value={localState.value}
				onValueChange={handleValueChange}
			/>
		);
	},
);

RadioGroup.displayName = "MobxRadioGroup";

export { RadioGroupComponent };
export type {
	BaseRadioGroupProps,
	RadioGroupSize,
	RadioGroupColor,
	RadioGroupOrientation,
	RadioGroupRef,
	MobxRadioGroupProps,
};
