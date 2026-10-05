import { Description as HeroDescription } from "heroui-native/description";
import { FieldError as HeroFieldError } from "heroui-native/field-error";
import { Label as HeroLabel } from "heroui-native/label";
import {
	TextArea as HeroTextArea,
	textAreaClassNames,
} from "heroui-native/text-area";
import { TextField as HeroTextField } from "heroui-native/text-field";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type ReactNode,
} from "react";

type HeroTextAreaProps = ComponentPropsWithoutRef<typeof HeroTextArea>;

interface TextareaFieldProps {
	description?: ReactNode;
	errorMessage?: ReactNode;
	helperText?: ReactNode;
	isRequired?: boolean;
	label?: ReactNode;
}

export interface PureTextareaProps
	extends Omit<
			HeroTextAreaProps,
			| "onBlur"
			| "onChange"
			| "onChangeText"
			| "value"
			| keyof TextareaFieldProps
		>,
		TextareaFieldProps {
	onBlur?: (value: string) => void;
	onChange?: (value: string) => void;
	value?: string;
}

const PureTextareaComponent = forwardRef<
	ComponentRef<typeof HeroTextArea>,
	PureTextareaProps
>(
	(
		{
			description,
			errorMessage,
			helperText,
			isDisabled,
			isInvalid,
			isRequired,
			label,
			onBlur,
			onChange,
			value = "",
			...rest
		},
		ref,
	) => {
		const resolvedInvalid = Boolean(isInvalid || errorMessage);
		const hasTextField = Boolean(
			label || description || helperText || errorMessage || isRequired,
		);
		const textarea = (
			<HeroTextArea
				{...rest}
				isDisabled={isDisabled}
				isInvalid={resolvedInvalid}
				onBlur={() => {
					onBlur?.(value);
				}}
				onChangeText={onChange}
				ref={ref}
				value={value}
			/>
		);

		if (!hasTextField) {
			return textarea;
		}

		return (
			<HeroTextField
				isDisabled={isDisabled}
				isInvalid={resolvedInvalid}
				isRequired={isRequired}
			>
				{label && <HeroLabel>{label}</HeroLabel>}
				{textarea}
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
PureTextareaComponent.displayName = "PureTextarea";

export const PureTextarea = Object.assign(PureTextareaComponent, {
	Description: HeroDescription,
	Error: HeroFieldError,
	FieldError: HeroFieldError,
	Label: HeroLabel,
}) as typeof PureTextareaComponent & {
	Description: typeof HeroDescription;
	Error: typeof HeroFieldError;
	FieldError: typeof HeroFieldError;
	Label: typeof HeroLabel;
};
export const Textarea = PureTextarea;
export const TextArea = Textarea;
export type TextareaProps = PureTextareaProps;
export { textAreaClassNames };
