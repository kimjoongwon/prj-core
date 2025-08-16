import { get } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useFormField } from "@shared/hooks";
import { MobxProps } from "../../../types";
import {
	Switch as BaseSwitch,
	type SwitchProps as BaseSwitchProps,
} from "./Switch";

export interface SwitchProps<T>
	extends MobxProps<T>,
		Omit<BaseSwitchProps, "value" | "onValueChange"> {}

export const Switch = observer(<T extends object>(props: SwitchProps<T>) => {
	const { path = "", state = {}, ...rest } = props;

	const initialValue = get(state, path, false);

	const { localState } = useFormField({ initialValue, state, path });

	const handleValueChange = action((isSelected: boolean) => {
		localState.value = isSelected;
	});

	return (
		<BaseSwitch
			{...rest}
			value={localState.value}
			onValueChange={handleValueChange}
		/>
	);
});

// Re-export types for backwards compatibility
export type { BaseSwitchProps as PureSwitchProps };
