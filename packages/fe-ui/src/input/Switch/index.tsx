"use client";

import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { Switch as PureSwitch } from "./Switch";
import type { SwitchProps as PureSwitchProps } from "./Switch.props";

export interface SwitchProps<T>
	extends MobxProps<T>,
		Omit<PureSwitchProps, "value" | "onValueChange"> {}

const Switch = observer(<T extends object>(props: SwitchProps<T>) => {
	const { path, state, ...rest } = props;

	const initialValue = tools.get(state, path, false) as boolean;

	const formField = useFormField<T, boolean>({
		value: initialValue,
		state,
		path,
	});

	const handleValueChange = (isSelected: boolean) => {
		formField.setValue(isSelected);
	};

	return (
		<PureSwitch
			{...rest}
			value={formField.state.value as boolean}
			onValueChange={handleValueChange}
		/>
	);
});

export { Switch };
