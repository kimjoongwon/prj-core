import {
	Description as HeroDescription,
	FieldError as HeroFieldError,
	InputOTP as HeroInputOTP,
	Label as HeroLabel,
	TextField as HeroTextField,
	inputOTPClassNames,
	REGEXP_ONLY_CHARS,
	REGEXP_ONLY_DIGITS,
	REGEXP_ONLY_DIGITS_AND_CHARS,
	useInputOTP,
} from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type ReactNode,
} from "react";

type HeroInputOTPProps = ComponentPropsWithoutRef<typeof HeroInputOTP>;

interface InputOTPFieldProps {
	description?: ReactNode;
	errorMessage?: ReactNode;
	helperText?: ReactNode;
	isInvalid?: boolean;
	isRequired?: boolean;
	label?: ReactNode;
}

export interface PureInputOTPProps
	extends Omit<
			HeroInputOTPProps,
			"maxLength" | "onChange" | "value" | keyof InputOTPFieldProps
		>,
		InputOTPFieldProps {
	maxLength?: number;
	onChange?: (value: string) => void;
	value?: string;
}

const PureInputOTPComponent = forwardRef<
	ComponentRef<typeof HeroInputOTP>,
	PureInputOTPProps
>(
	(
		{
			children,
			description,
			errorMessage,
			helperText,
			isInvalid,
			isRequired,
			label,
			maxLength = 6,
			onChange,
			value,
			...rest
		},
		ref,
	) => {
		const resolvedInvalid = Boolean(isInvalid || errorMessage);
		const hasTextField = Boolean(
			label || description || helperText || errorMessage || isRequired,
		);
		const inputOTP = (
			<HeroInputOTP
				{...rest}
				isInvalid={resolvedInvalid}
				maxLength={maxLength}
				onChange={onChange}
				ref={ref}
				value={value}
			>
				{children ?? (
					<HeroInputOTP.Group>
						{Array.from(
							{
								length: maxLength,
							},
							(_, index) => {
								// OTP slots are positional controls, so their slot index is their identity.
								const slotKey = `otp-slot-${index}`;
								return <HeroInputOTP.Slot index={index} key={slotKey} />;
							},
						)}
					</HeroInputOTP.Group>
				)}
			</HeroInputOTP>
		);

		if (!hasTextField) {
			return inputOTP;
		}

		return (
			<HeroTextField isInvalid={resolvedInvalid} isRequired={isRequired}>
				{label && <HeroLabel>{label}</HeroLabel>}
				{inputOTP}
				{description && (
					<HeroDescription hideOnInvalid={Boolean(errorMessage)}>
						{description}
					</HeroDescription>
				)}
				{helperText && (
					<HeroDescription hideOnInvalid={Boolean(errorMessage)}>
						{helperText}
					</HeroDescription>
				)}
				{errorMessage && <HeroFieldError>{errorMessage}</HeroFieldError>}
			</HeroTextField>
		);
	},
);
PureInputOTPComponent.displayName = "PureInputOTP";

export const PureInputOTP = Object.assign(PureInputOTPComponent, {
	Description: HeroDescription,
	Error: HeroFieldError,
	FieldError: HeroFieldError,
	Group: HeroInputOTP.Group,
	Label: HeroLabel,
	Separator: HeroInputOTP.Separator,
	Slot: HeroInputOTP.Slot,
	SlotCaret: HeroInputOTP.SlotCaret,
	SlotPlaceholder: HeroInputOTP.SlotPlaceholder,
	SlotValue: HeroInputOTP.SlotValue,
}) as typeof PureInputOTPComponent &
	Pick<
		typeof HeroInputOTP,
		| "Group"
		| "Separator"
		| "Slot"
		| "SlotCaret"
		| "SlotPlaceholder"
		| "SlotValue"
	> & {
		Description: typeof HeroDescription;
		Error: typeof HeroFieldError;
		FieldError: typeof HeroFieldError;
		Label: typeof HeroLabel;
	};
export const InputOTP = PureInputOTP;
export type InputOTPProps = PureInputOTPProps;
export {
	REGEXP_ONLY_CHARS,
	REGEXP_ONLY_DIGITS,
	REGEXP_ONLY_DIGITS_AND_CHARS,
	inputOTPClassNames,
	useInputOTP,
};
