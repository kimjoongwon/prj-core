"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	inputOTPClassNames,
	PureInputOTP,
	type PureInputOTPProps,
	REGEXP_ONLY_CHARS,
	REGEXP_ONLY_DIGITS,
	REGEXP_ONLY_DIGITS_AND_CHARS,
	useInputOTP,
} from "./InputOTP";

export interface InputOTPProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureInputOTPProps, "onChange" | "value"> {}

const InputOTP = observer(
	<TState extends object>(props: InputOTPProps<TState>) => {
		const { path, state, ...rest } = props;
		const field = useFormField<TState, string>({
			path,
			state,
			value: (tools.get(state, path) ?? "") as string,
		});

		return (
			<PureInputOTP
				{...rest}
				onChange={field.setValue}
				value={field.state.value}
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
