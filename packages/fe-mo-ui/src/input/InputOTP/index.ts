import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	InputOTP as HeroInputOTP,
	REGEXP_ONLY_CHARS,
	REGEXP_ONLY_DIGITS,
	REGEXP_ONLY_DIGITS_AND_CHARS,
	inputOTPClassNames,
	useInputOTP,
} from "heroui-native/input-otp";

type HeroInputOTPProps = ComponentPropsWithoutRef<typeof HeroInputOTP>;

export interface PureInputOTPProps
	extends Omit<HeroInputOTPProps, "onChange" | "value"> {
	onChange?: (value: string) => void;
	value?: string;
}

const PureInputOTPComponent = forwardRef<
	ElementRef<typeof HeroInputOTP>,
	PureInputOTPProps
>(({ children, maxLength, onChange, value, ...rest }, ref) =>
	createElement(
		HeroInputOTP,
		{
			...rest,
			maxLength,
			onChange,
			ref,
			value,
		},
		children ??
			createElement(
				HeroInputOTP.Group,
				null,
				Array.from({ length: maxLength }, (_, index) =>
					createElement(HeroInputOTP.Slot, {
						index,
						key: index,
					}),
				),
			),
	),
);

PureInputOTPComponent.displayName = "PureInputOTP";

export interface InputOTPProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureInputOTPProps, "onChange" | "value"> {}

const InputOTPComponent = observer(<TState extends object>(props: InputOTPProps<TState>) => {
	const { path, state, ...rest } = props;
	const field = useFormField<TState, string>({
		path,
		state,
		value: (tools.get(state, path) ?? "") as string,
	});

	return createElement(PureInputOTPComponent, {
		...rest,
		onChange: field.setValue,
		value: field.state.value,
	});
});

InputOTPComponent.displayName = "InputOTP";

export const InputOTP = Object.assign(InputOTPComponent, {
	Group: HeroInputOTP.Group,
	Separator: HeroInputOTP.Separator,
	Slot: HeroInputOTP.Slot,
	SlotCaret: HeroInputOTP.SlotCaret,
	SlotPlaceholder: HeroInputOTP.SlotPlaceholder,
	SlotValue: HeroInputOTP.SlotValue,
}) as typeof InputOTPComponent &
	Pick<
		typeof HeroInputOTP,
		"Group" | "Separator" | "Slot" | "SlotCaret" | "SlotPlaceholder" | "SlotValue"
	>;

export {
	REGEXP_ONLY_CHARS,
	REGEXP_ONLY_DIGITS,
	REGEXP_ONLY_DIGITS_AND_CHARS,
	inputOTPClassNames,
	useInputOTP,
};
