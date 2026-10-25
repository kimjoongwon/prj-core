"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import type { MobxProps, Paths } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import {
	inputOTPClassNames,
	PureInputOTP,
	type PureInputOTPProps,
	REGEXP_ONLY_CHARS,
	REGEXP_ONLY_DIGITS,
	REGEXP_ONLY_DIGITS_AND_CHARS,
	useInputOTP,
} from "./InputOTP";
import { useRegisterInputState } from "../input-state-inspection";

type BoundInputOTPProps<TState extends object> = MobxProps<TState> &
	(Omit<PureInputOTPProps, "onChange" | "value"> & {
		value?: never;
		defaultValue?: string;
		onChange?: PureInputOTPProps["onChange"];
	});
type UnboundInputOTPProps = Omit<PureInputOTPProps, "onChange" | "value"> & {
	state?: never;
	path?: never;
	value?: string;
	defaultValue?: string;
	onChange?: PureInputOTPProps["onChange"];
};
export type InputOTPProps<TState extends object = Record<string, unknown>> =
	| BoundInputOTPProps<TState>
	| UnboundInputOTPProps;
export function createInputOTPState(value = "") {
	const state = {
		value,
		setValue(nextValue: string) {
			state.value = nextValue;
		},
	};
	return makeAutoObservable(
		state,
		{},
		{ autoBind: true, name: "InputOTPState" },
	);
}
export type InputOTPState = ReturnType<typeof createInputOTPState>;

const InputOTP = observer(
	<TState extends object>(props: InputOTPProps<TState>) => {
		const {
			defaultValue,
			onChange,
			path,
			state,
			value: controlledValue,
			...rest
		} = props;
		const localState = useLocalObservable(() =>
			createInputOTPState(defaultValue ?? ""),
		);
		const field = useFormField<TState, string>({
			path: (state && path ? path : "value") as Paths<TState, 4>,
			state: (state ?? localState) as TState,
			defaultValue: defaultValue ?? "",
		});
		const isBound = state !== undefined && path !== undefined;
		const isControlled = !isBound && controlledValue !== undefined;
		useRegisterInputState(
			() => (isControlled ? controlledValue : field.state.value),
			isControlled ? controlledValue : field.state.value,
		);

		return (
			<PureInputOTP
				{...rest}
				onChange={(nextValue) => {
					if (!isControlled) field.setValue(nextValue);
					onChange?.(nextValue);
				}}
				value={isControlled ? controlledValue : field.state.value}
			/>
		);
	},
);
InputOTP.displayName = "InputOTP";

const InputOTPWithStatics = Object.assign(InputOTP, {
	Description: PureInputOTP.Description,
	Error: PureInputOTP.Error,
	FieldError: PureInputOTP.FieldError,
	Group: PureInputOTP.Group,
	Label: PureInputOTP.Label,
	Separator: PureInputOTP.Separator,
	Slot: PureInputOTP.Slot,
	SlotCaret: PureInputOTP.SlotCaret,
	SlotPlaceholder: PureInputOTP.SlotPlaceholder,
	SlotValue: PureInputOTP.SlotValue,
}) as typeof InputOTP &
	Pick<
		typeof PureInputOTP,
		| "Group"
		| "Separator"
		| "Slot"
		| "SlotCaret"
		| "SlotPlaceholder"
		| "SlotValue"
	> & {
		Description: typeof PureInputOTP.Description;
		Error: typeof PureInputOTP.Error;
		FieldError: typeof PureInputOTP.FieldError;
		Label: typeof PureInputOTP.Label;
	};
export { InputOTPWithStatics as InputOTP };
export {
	REGEXP_ONLY_CHARS,
	REGEXP_ONLY_DIGITS,
	REGEXP_ONLY_DIGITS_AND_CHARS,
	inputOTPClassNames,
	useInputOTP,
};
export type { PureInputOTPProps };
