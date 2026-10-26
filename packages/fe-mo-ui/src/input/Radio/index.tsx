"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import type { MobxProps, Paths } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import {
	PureRadio,
	type PureRadioProps,
	radioClassNames,
	useRadio,
} from "./Radio";
import { useRegisterInputState } from "../input-state-inspection";

type BoundRadioProps<TState extends object> = MobxProps<TState> &
	(Omit<PureRadioProps, "isSelected" | "onSelectedChange"> & {
		isSelected?: never;
		defaultValue?: boolean;
		onSelectedChange?: PureRadioProps["onSelectedChange"];
	});
type UnboundRadioProps = Omit<
	PureRadioProps,
	"isSelected" | "onSelectedChange"
> & {
	state?: never;
	path?: never;
	isSelected?: boolean;
	defaultValue?: boolean;
	onSelectedChange?: PureRadioProps["onSelectedChange"];
};
export type RadioProps<TState extends object = Record<string, unknown>> =
	| BoundRadioProps<TState>
	| UnboundRadioProps;
export function createRadioState(value = false) {
	const state = {
		value,
		setValue(nextValue: boolean) {
			state.value = nextValue;
		},
	};
	return makeAutoObservable(state, {}, { autoBind: true, name: "RadioState" });
}
export type RadioState = ReturnType<typeof createRadioState>;

const Radio = observer(<TState extends object>(props: RadioProps<TState>) => {
	const {
		defaultValue,
		isSelected: controlledValue,
		onSelectedChange,
		path,
		state,
		...rest
	} = props;
	const localState = useLocalObservable(() =>
		createRadioState(defaultValue ?? false),
	);
	const field = useFormField<TState, boolean>({
		path: (state && path ? path : "value") as Paths<TState, 4>,
		state: (state ?? localState) as TState,
		defaultValue: defaultValue ?? false,
	});
	const isBound = state !== undefined && path !== undefined;
	const isControlled = !isBound && controlledValue !== undefined;
	useRegisterInputState(
		() => (isControlled ? controlledValue : field.state.value),
		isControlled ? controlledValue : field.state.value,
	);

	return (
		<PureRadio
			{...rest}
			isSelected={isControlled ? controlledValue : Boolean(field.state.value)}
			onSelectedChange={(nextValue) => {
				if (!isControlled) field.setValue(nextValue);
				onSelectedChange?.(nextValue);
			}}
		/>
	);
});
Radio.displayName = "Radio";

const RadioWithStatics = Object.assign(Radio, {
	Indicator: PureRadio.Indicator,
}) as typeof Radio & Pick<typeof PureRadio, "Indicator">;
export { RadioWithStatics as Radio };
export { PureRadio, radioClassNames, useRadio };
export type { PureRadioProps };
