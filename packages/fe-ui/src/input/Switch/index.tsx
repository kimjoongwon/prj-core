"use client";

import { useFormField } from "@cocrepo/hook";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { Switch as PureSwitch } from "./Switch";
import type { SwitchProps as PureSwitchProps } from "./Switch.props";

export type SwitchProps<T extends object = object> =
	| (MobxProps<T> & Omit<PureSwitchProps, "value" | "onValueChange">)
	| PureSwitchProps;

const Switch = observer(<T extends object>(props: SwitchProps<T>) => {
	if (!("state" in props && "path" in props)) return <PureSwitch {...props} />;
	const { path, state, ...rest } = props;

	const formField = useFormField<T, boolean>({
		defaultValue: false,
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

export type { SwitchState } from "./Switch";
export { createSwitchState } from "./Switch";
export { Switch };
