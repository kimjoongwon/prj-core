import {
	descriptionClassNames,
	Description as HeroDescription,
} from "heroui-native/description";
import {
	fieldErrorClassNames,
	FieldError as HeroFieldError,
} from "heroui-native/field-error";
import { Input as HeroInput, inputClassNames } from "heroui-native/input";
import {
	InputGroup as HeroInputGroup,
	inputGroupClassNames,
} from "heroui-native/input-group";
import { Label as HeroLabel, labelClassNames } from "heroui-native/label";
import {
	TextField as HeroTextField,
	textFieldClassNames,
	useTextField,
} from "heroui-native/text-field";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type ReactNode,
} from "react";
import { Textarea } from "../Textarea";

type HeroInputProps = ComponentPropsWithoutRef<typeof HeroInput>;
type HeroTextFieldProps = ComponentPropsWithoutRef<typeof HeroTextField>;

interface TextFieldInputFieldProps {
	description?: ReactNode;
	endContent?: ReactNode;
	errorMessage?: ReactNode;
	helperText?: ReactNode;
	isRequired?: boolean;
	label?: ReactNode;
	startContent?: ReactNode;
}

export interface TextFieldInputProps
	extends Omit<
			HeroInputProps,
			| "onBlur"
			| "onChange"
			| "onChangeText"
			| "value"
			| keyof TextFieldInputFieldProps
		>,
		TextFieldInputFieldProps {
	onBlur?: (value: string) => void;
	onChange?: (value: string) => void;
	value?: string;
}

const TextFieldInputComponent = forwardRef<
	ComponentRef<typeof HeroInput>,
	TextFieldInputProps
>(
	(
		{
			description,
			endContent,
			errorMessage,
			helperText,
			isDisabled,
			isInvalid,
			isRequired,
			label,
			onBlur,
			onChange,
			startContent,
			value = "",
			...rest
		},
		ref,
	) => {
		const resolvedInvalid = Boolean(isInvalid || errorMessage);
		const hasInputGroup = Boolean(startContent || endContent);
		const hasTextField = Boolean(
			label || description || helperText || errorMessage || isRequired,
		);
		const inputProps = {
			...rest,
			isDisabled,
			isInvalid: resolvedInvalid,
			onBlur: () => {
				onBlur?.(value);
			},
			onChangeText: onChange,
			ref,
			value,
		};
		const input = hasInputGroup ? (
			<HeroInputGroup isDisabled={isDisabled}>
				{startContent && (
					<HeroInputGroup.Prefix isDecorative>
						{startContent}
					</HeroInputGroup.Prefix>
				)}
				<HeroInputGroup.Input {...inputProps} />
				{endContent && (
					<HeroInputGroup.Suffix>{endContent}</HeroInputGroup.Suffix>
				)}
			</HeroInputGroup>
		) : (
			<HeroInput {...inputProps} />
		);

		if (!hasTextField) {
			return input;
		}

		return (
			<HeroTextField
				isDisabled={isDisabled}
				isInvalid={resolvedInvalid}
				isRequired={isRequired}
			>
				{label && <HeroLabel>{label}</HeroLabel>}
				{input}
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
TextFieldInputComponent.displayName = "TextField.Input";

export const TextFieldInput = Object.assign(TextFieldInputComponent, {
	Description: HeroDescription,
	Error: HeroFieldError,
	FieldError: HeroFieldError,
	Group: HeroInputGroup,
	InputGroup: HeroInputGroup,
	Label: HeroLabel,
}) as typeof TextFieldInputComponent & {
	Description: typeof HeroDescription;
	Error: typeof HeroFieldError;
	FieldError: typeof HeroFieldError;
	Group: typeof HeroInputGroup;
	InputGroup: typeof HeroInputGroup;
	Label: typeof HeroLabel;
};

export type PureTextFieldProps = HeroTextFieldProps;

const TextFieldComponent = forwardRef<
	ComponentRef<typeof HeroTextField>,
	PureTextFieldProps
>((props, ref) => <HeroTextField {...props} ref={ref} />);
TextFieldComponent.displayName = "TextField";

export const TextField = Object.assign(TextFieldComponent, {
	Description: HeroDescription,
	Error: HeroFieldError,
	FieldError: HeroFieldError,
	Group: HeroInputGroup,
	Input: TextFieldInput,
	InputGroup: HeroInputGroup,
	Label: HeroLabel,
	Textarea,
}) as typeof TextFieldComponent & {
	Description: typeof HeroDescription;
	Error: typeof HeroFieldError;
	FieldError: typeof HeroFieldError;
	Group: typeof HeroInputGroup;
	Input: typeof TextFieldInput;
	InputGroup: typeof HeroInputGroup;
	Label: typeof HeroLabel;
	Textarea: typeof Textarea;
};

export {
	descriptionClassNames,
	fieldErrorClassNames,
	inputClassNames,
	inputGroupClassNames,
	labelClassNames,
	textFieldClassNames,
	useTextField,
};
