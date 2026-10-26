"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import type { MobxProps, Paths } from "@cocrepo/type";
import { observer, useLocalObservable } from "mobx-react-lite";
import {
	descriptionClassNames,
	fieldErrorClassNames,
	inputClassNames,
	inputGroupClassNames,
	labelClassNames,
	TextField as PureTextField,
	createTextFieldState,
	type PureTextFieldProps,
	type TextFieldInputProps,
	textFieldClassNames,
	useTextField,
} from "./TextField";

type BoundTextFieldProps<TState extends object> = MobxProps<TState> &
	Omit<TextFieldInputProps, "onBlur" | "onChange" | "value"> & {
		defaultValue?: string;
		onBlur?: TextFieldInputProps["onBlur"];
		onChange?: TextFieldInputProps["onChange"];
		value?: string;
	};
type UnboundTextFieldProps = Omit<
	TextFieldInputProps,
	"onBlur" | "onChange" | "value"
> & {
	state?: never;
	path?: never;
	defaultValue?: string;
	onBlur?: TextFieldInputProps["onBlur"];
	onChange?: TextFieldInputProps["onChange"];
	value?: string;
};

export { createTextFieldState } from "./TextField";
export type { TextFieldState } from "./TextField";

export type TextFieldProps<TState extends object = Record<string, unknown>> =
	| BoundTextFieldProps<TState>
	| UnboundTextFieldProps
	| PureTextFieldProps;

function isBoundTextFieldProps<TState extends object>(
	props: TextFieldProps<TState>,
): props is BoundTextFieldProps<TState> {
	return "state" in props && "path" in props;
}

const TextField = observer(
	<TState extends object>(props: TextFieldProps<TState>) => {
		if (
			!isBoundTextFieldProps(props) &&
			(props as { children?: unknown }).children != null
		) {
			return <PureTextField {...(props as PureTextFieldProps)} />;
		}

		const { defaultValue, onBlur, onChange, path, state, value, ...rest } =
			props as BoundTextFieldProps<TState>;
		const localState = useLocalObservable(() =>
			createTextFieldState(defaultValue ?? ""),
		);
		const isBound = state !== undefined && path !== undefined;
		const field = useFormField<TState, string>({
			path: (state && path ? path : "value") as Paths<TState, 4>,
			state: (state ?? localState) as TState,
			defaultValue: defaultValue ?? "",
		});
		const resolvedValue = isBound
			? field.state.value
			: value !== undefined
				? value
				: field.state.value;
		const isControlled = !isBound && value !== undefined;

		return (
			<PureTextField.Input
				{...rest}
				onBlur={(nextValue) => {
					if (!isControlled) field.setValue(nextValue);
					onBlur?.(nextValue);
				}}
				onChange={(nextValue) => {
					if (!isControlled) field.setValue(nextValue);
					onChange?.(nextValue);
				}}
				value={resolvedValue}
			/>
		);
	},
);
TextField.displayName = "TextField";

const TextFieldWithStatics = Object.assign(TextField, {
	Description: PureTextField.Description,
	Error: PureTextField.Error,
	FieldError: PureTextField.FieldError,
	Group: PureTextField.Group,
	Input: PureTextField.Input,
	InputGroup: PureTextField.InputGroup,
	Label: PureTextField.Label,
	Textarea: PureTextField.Textarea,
}) as typeof TextField &
	Pick<
		typeof PureTextField,
		| "Description"
		| "Error"
		| "FieldError"
		| "Group"
		| "Input"
		| "InputGroup"
		| "Label"
		| "Textarea"
	>;

export {
	descriptionClassNames,
	fieldErrorClassNames,
	inputClassNames,
	inputGroupClassNames,
	labelClassNames,
	TextFieldWithStatics as TextField,
	textFieldClassNames,
	useTextField,
};
export type {
	PureTextFieldProps,
	TextFieldInputProps,
	TextFieldInputProps as PureTextFieldInputProps,
};
