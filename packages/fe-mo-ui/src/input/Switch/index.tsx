"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	PureSwitch,
	type PureSwitchProps,
	switchClassNames,
	useSwitch,
} from "./Switch";

export interface SwitchProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureSwitchProps, "onValueChange" | "value"> {}

const Switch = observer(<TState extends object>(props: SwitchProps<TState>) => {
	const { path, state, ...rest } = props;
	const field = useFormField<TState, boolean>({
		path,
		state,
		value: (tools.get(state, path) ?? false) as boolean,
	});
	const isSelected = Boolean(field.state.value);

	return (
		<PureSwitch {...rest} onValueChange={field.setValue} value={isSelected} />
	);
});
Switch.displayName = "Switch";

const SwitchWithStatics = Object.assign(Switch, {
	EndContent: PureSwitch.EndContent,
	StartContent: PureSwitch.StartContent,
	Thumb: PureSwitch.Thumb,
}) as typeof Switch &
	Pick<typeof PureSwitch, "EndContent" | "StartContent" | "Thumb">;
export { SwitchWithStatics as Switch };
export { switchClassNames, useSwitch };
export type { PureSwitchProps };
