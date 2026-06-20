import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import {
	Description as HeroDescription,
	FieldError as HeroFieldError,
	Input as HeroInput,
	InputGroup as HeroInputGroup,
	Label as HeroLabel,
	TextField as HeroTextField,
	inputClassNames,
} from "heroui-native";
import { observer } from "mobx-react-lite";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type ReactNode,
} from "react";

type HeroInputProps = ComponentPropsWithoutRef<typeof HeroInput>;
interface InputFieldProps {
	description?: ReactNode;
	endContent?: ReactNode;
	errorMessage?: ReactNode;
	helperText?: ReactNode;
	isRequired?: boolean;
	label?: ReactNode;
	startContent?: ReactNode;
}
export interface PureInputProps
	extends Omit<
			HeroInputProps,
			"onBlur" | "onChange" | "onChangeText" | "value" | keyof InputFieldProps
		>,
		InputFieldProps {
	onBlur?: (value: string) => void;
	onChange?: (value: string) => void;
	value?: string;
}
const PureInputComponent = forwardRef<
	ComponentRef<typeof HeroInput>,
	PureInputProps
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
PureInputComponent.displayName = "PureInput";
export interface InputProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureInputProps, "onBlur" | "onChange" | "value"> {}
const InputComponent = observer(
	<TState extends object>(props: InputProps<TState>) => {
		const { path, state, ...rest } = props;
		const field = useFormField<TState, string>({
			path,
			state,
			value: (tools.get(state, path) ?? "") as string,
		});
		return (
			<PureInputComponent
				{...rest}
				onBlur={field.setValue}
				onChange={field.setValue}
				value={field.state.value}
			/>
		);
	},
);
InputComponent.displayName = "Input";
export const Input = Object.assign(InputComponent, {
	Description: HeroDescription,
	Error: HeroFieldError,
	FieldError: HeroFieldError,
	Group: HeroInputGroup,
	InputGroup: HeroInputGroup,
	Label: HeroLabel,
}) as typeof InputComponent & {
	Description: typeof HeroDescription;
	Error: typeof HeroFieldError;
	FieldError: typeof HeroFieldError;
	Group: typeof HeroInputGroup;
	InputGroup: typeof HeroInputGroup;
	Label: typeof HeroLabel;
};
export { inputClassNames };
