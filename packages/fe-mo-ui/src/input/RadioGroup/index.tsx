"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import type { MobxProps, Paths } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import {
	PureRadioGroup,
	type PureRadioGroupProps,
	type RadioOption,
	radioGroupClassNames,
	useRadioGroup,
	useRadioGroupItem,
} from "./RadioGroup";
import { useRegisterInputState } from "../input-state-inspection";

type BoundRadioGroupProps<TState extends object> = MobxProps<TState> &
	(Omit<PureRadioGroupProps, "onValueChange" | "value"> & {
		value?: never;
		defaultValue?: string;
		onValueChange?: PureRadioGroupProps["onValueChange"];
	});
type UnboundRadioGroupProps = Omit<
	PureRadioGroupProps,
	"onValueChange" | "value"
> & {
	state?: never;
	path?: never;
	value?: string;
	defaultValue?: string;
	onValueChange?: PureRadioGroupProps["onValueChange"];
};
export type RadioGroupProps<TState extends object = Record<string, unknown>> =
	| BoundRadioGroupProps<TState>
	| UnboundRadioGroupProps;
export function createRadioGroupState(value = "") {
	const state = {
		value,
		setValue(nextValue: string) {
			state.value = nextValue;
		},
	};
	return makeAutoObservable(
		state,
		{},
		{ autoBind: true, name: "RadioGroupState" },
	);
}
export type RadioGroupState = ReturnType<typeof createRadioGroupState>;

const RadioGroup = observer(
	<TState extends object>(props: RadioGroupProps<TState>) => {
		const {
			defaultValue,
			onValueChange,
			options = [],
			path,
			state,
			value: controlledValue,
			...rest
		} = props;
		const fallback = defaultValue ?? options[0]?.value ?? "";
		const localState = useLocalObservable(() =>
			createRadioGroupState(fallback),
		);
		const field = useFormField<TState, string>({
			path: (state && path ? path : "value") as Paths<TState, 4>,
			state: (state ?? localState) as TState,
			defaultValue: fallback,
		});
		const isBound = state !== undefined && path !== undefined;
		const isControlled = !isBound && controlledValue !== undefined;
		const value = isControlled ? controlledValue : field.state.value;
		useRegisterInputState(
			() => (isControlled ? controlledValue : field.state.value),
			isControlled ? controlledValue : field.state.value,
		);

		return (
			<PureRadioGroup
				{...rest}
				onValueChange={(nextValue) => {
					if (!isControlled) field.setValue(nextValue);
					onValueChange?.(nextValue);
				}}
				options={options}
				value={value}
			/>
		);
	},
);
RadioGroup.displayName = "RadioGroup";

const RadioGroupWithStatics = Object.assign(RadioGroup, {
	Item: PureRadioGroup.Item,
}) as typeof RadioGroup & {
	Item: typeof PureRadioGroup.Item;
};
export { RadioGroupWithStatics as RadioGroup };
export { radioGroupClassNames, useRadioGroup, useRadioGroupItem };
export type { PureRadioGroupProps, RadioOption };
