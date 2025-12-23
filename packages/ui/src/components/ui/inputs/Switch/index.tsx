import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	Switch as BaseSwitch,
	type SwitchProps as BaseSwitchProps,
} from "./Switch";

export interface SwitchProps<T>
	extends MobxProps<T>,
		Omit<BaseSwitchProps, "value" | "onValueChange"> {}

export const Switch = observer(<T extends object>(props: SwitchProps<T>) => {
	const { path, state, ...rest } = props;

	const initialValue = tools.get(state, path, false);

	const formField = useFormField({ value: initialValue, state, path });

	const handleValueChange = (isSelected: boolean) => {
		formField.setValue(isSelected);
	};

	return (
		<BaseSwitch
			{...rest}
			value={formField.state.value}
			onValueChange={handleValueChange}
		/>
	);
});

// Re-export types for backwards compatibility
export type { BaseSwitchProps as PureSwitchProps };
