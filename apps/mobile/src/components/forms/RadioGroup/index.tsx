import { Tool } from "@shared/utils";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useFormField } from "@shared/hooks";
import { MobxProps } from "@shared/types";
import {
	RadioGroup as RadioGroupComponent,
	RadioGroupProps as BaseRadioGroupProps,
	RadioOption,
	RadioGroupSize,
	RadioGroupColor,
	RadioGroupOrientation,
	RadioGroupRef,
	MobxRadioGroupProps,
} from "./RadioGroup";

export interface RadioGroupProps<T, D = any>
	extends MobxProps<T>,
		Omit<BaseRadioGroupProps<D>, "value" | "onValueChange" | "onDataChange"> {
	options: RadioOption<D>[];
	dataPath?: string;
}

export const RadioGroup = observer(
	<T extends object, D = any>(props: RadioGroupProps<T, D>) => {
		const { state, path, dataPath, options, ...rest } = props;

		const initialValue = Tool.get(state, path) || "";
		const initialDataValue = dataPath ? Tool.get(state, dataPath) : undefined;

		const { localState } = useFormField({
			initialValue,
			state,
			path,
		});

		const { localState: dataLocalState } = useFormField({
			initialValue: initialDataValue,
			state,
			path: dataPath as any || '',
		});

		const handleValueChange = action((value: string) => {
			localState.value = value;
		});

		const handleDataChange = action((data: D | undefined) => {
			if (dataPath && data !== undefined) {
				dataLocalState.value = data;
			}
		});

		return (
			<RadioGroupComponent<D>
				{...rest}
				options={options}
				value={localState.value}
				onValueChange={handleValueChange}
				onDataChange={dataPath ? handleDataChange : undefined}
			/>
		);
	},
);

RadioGroup.displayName = "MobxRadioGroup";

export { RadioGroupComponent };
export type {
	BaseRadioGroupProps,
	RadioOption,
	RadioGroupSize,
	RadioGroupColor,
	RadioGroupOrientation,
	RadioGroupRef,
	MobxRadioGroupProps,
};
