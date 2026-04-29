import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { observer } from "mobx-react-lite";
import {
	InputOTP as HeroInputOTP,
	REGEXP_ONLY_CHARS,
	REGEXP_ONLY_DIGITS,
	REGEXP_ONLY_DIGITS_AND_CHARS,
	inputOTPClassNames,
	useInputOTP,
} from "heroui-native/input-otp";
import {
	type FieldChromeProps,
	renderTextFieldChrome,
	resolveFieldInvalid,
} from "../../internal/fieldChrome";
import { type MobxProps, useMobxField } from "../../internal/useMobxField";

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
		FieldChromeProps,
		Omit<PureInputOTPProps, "onChange" | "value"> {}

const InputOTPComponent = observer(<TState extends object>(props: InputOTPProps<TState>) => {
	const {
		description,
		descriptionProps,
		error,
		fieldErrorProps,
		isDisabled,
		isInvalid,
		isRequired,
		label,
		labelProps,
		path,
		state,
		...rest
	} = props;
	const field = useMobxField({ fallback: "", path, state });
	const fieldChrome = {
		description,
		descriptionProps,
		error,
		fieldErrorProps,
		isDisabled,
		isInvalid,
		isRequired,
		label,
		labelProps,
	};
	const resolvedInvalid = resolveFieldInvalid(fieldChrome);

	const control = createElement(PureInputOTPComponent, {
		...rest,
		isDisabled,
		isInvalid: resolvedInvalid,
		onChange: field.setValue,
		value: field.value,
	});

	return renderTextFieldChrome(
		{
			...fieldChrome,
			isInvalid: resolvedInvalid,
		},
		control,
	);
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
