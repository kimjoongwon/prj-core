"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import type { MobxProps, Paths } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import {
	PureSwitch,
	type PureSwitchProps,
	switchClassNames,
	useSwitch,
} from "./Switch";
import { useRegisterInputState } from "../input-state-inspection";

type BoundSwitchProps<TState extends object> = MobxProps<TState> &
	(Omit<PureSwitchProps, "onValueChange" | "value"> & {
		value?: never;
		defaultValue?: boolean;
		onValueChange?: PureSwitchProps["onValueChange"];
	});
type UnboundSwitchProps = Omit<PureSwitchProps, "onValueChange" | "value"> & {
	state?: never;
	path?: never;
	value?: boolean;
	defaultValue?: boolean;
	onValueChange?: PureSwitchProps["onValueChange"];
};
export type SwitchProps<TState extends object = Record<string, unknown>> =
	| BoundSwitchProps<TState>
	| UnboundSwitchProps;
export function createSwitchState(value = false) {
	const state = {
		value,
		setValue(nextValue: boolean) {
			state.value = nextValue;
		},
	};
	return makeAutoObservable(state, {}, { autoBind: true, name: "SwitchState" });
}
export type SwitchState = ReturnType<typeof createSwitchState>;

const Switch = observer(<TState extends object>(props: SwitchProps<TState>) => {
	const {
		defaultValue,
		onValueChange,
		path,
		state,
		value: controlledValue,
		...rest
	} = props;
	const localState = useLocalObservable(() =>
		createSwitchState(defaultValue ?? false),
	);
	const field = useFormField<TState, boolean>({
		path: (state && path ? path : "value") as Paths<TState, 4>,
		state: (state ?? localState) as TState,
		defaultValue: defaultValue ?? false,
	});
	const isBound = state !== undefined && path !== undefined;
	const isControlled = !isBound && controlledValue !== undefined;
	const isSelected = isControlled
		? controlledValue
		: Boolean(field.state.value);
	useRegisterInputState(
		() => (isControlled ? controlledValue : field.state.value),
		isControlled ? controlledValue : field.state.value,
	);

	return (
		<PureSwitch
			{...rest}
			onValueChange={(nextValue) => {
				if (!isControlled) field.setValue(nextValue);
				onValueChange?.(nextValue);
			}}
			value={isSelected}
		/>
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
