"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import type { MobxProps, Paths } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import {
	controlFieldClassNames,
	PureControlField,
	type PureControlFieldProps,
	useControlField,
} from "./ControlField";
import { useRegisterInputState } from "../input-state-inspection";

type BoundControlFieldProps<TState extends object> = MobxProps<TState> &
	(Omit<PureControlFieldProps, "isSelected" | "onSelectedChange"> & {
		isSelected?: never;
		defaultValue?: boolean;
		onSelectedChange?: PureControlFieldProps["onSelectedChange"];
	});
type UnboundControlFieldProps = Omit<
	PureControlFieldProps,
	"isSelected" | "onSelectedChange"
> & {
	state?: never;
	path?: never;
	isSelected?: boolean;
	defaultValue?: boolean;
	onSelectedChange?: PureControlFieldProps["onSelectedChange"];
};
export type ControlFieldProps<TState extends object = Record<string, unknown>> =
	| BoundControlFieldProps<TState>
	| UnboundControlFieldProps;
export function createControlFieldState(value = false) {
	const state = {
		value,
		setValue(nextValue: boolean) {
			state.value = nextValue;
		},
	};
	return makeAutoObservable(
		state,
		{},
		{ autoBind: true, name: "ControlFieldState" },
	);
}
export type ControlFieldState = ReturnType<typeof createControlFieldState>;

const ControlField = observer(
	<TState extends object>(props: ControlFieldProps<TState>) => {
		const {
			defaultValue,
			isSelected: controlledValue,
			onSelectedChange,
			path,
			state,
			...rest
		} = props;
		const localState = useLocalObservable(() =>
			createControlFieldState(defaultValue ?? false),
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
			<PureControlField
				{...rest}
				isSelected={isControlled ? controlledValue : Boolean(field.state.value)}
				onSelectedChange={(nextValue) => {
					if (!isControlled) field.setValue(nextValue);
					onSelectedChange?.(nextValue);
				}}
			/>
		);
	},
);

ControlField.displayName = "ControlField";
const ControlFieldWithStatics = Object.assign(
	ControlField,
	PureControlField,
) as typeof ControlField & typeof PureControlField;
export { ControlFieldWithStatics as ControlField };
export { controlFieldClassNames, PureControlField, useControlField };
export type { PureControlFieldProps };
export type * from "heroui-native/control-field";
