"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	descriptionClassNames,
	fieldErrorClassNames,
	inputClassNames,
	inputGroupClassNames,
	labelClassNames,
	TextField as PureTextField,
	type PureTextFieldProps,
	type TextFieldInputProps,
	textFieldClassNames,
	useTextField,
} from "./TextField";

type BoundTextFieldProps<TState extends object> = MobxProps<TState> &
	Omit<TextFieldInputProps, "onBlur" | "onChange" | "value">;

export type TextFieldProps<TState extends object = Record<string, unknown>> =
	| BoundTextFieldProps<TState>
	| PureTextFieldProps;

function isBoundTextFieldProps<TState extends object>(
	props: TextFieldProps<TState>,
): props is BoundTextFieldProps<TState> {
	return "state" in props && "path" in props;
}

const TextField = observer(
	<TState extends object>(props: TextFieldProps<TState>) => {
		if (!isBoundTextFieldProps(props)) {
			return <PureTextField {...props} />;
		}

		const { path, state, ...rest } = props;
		const field = useFormField<TState, string>({
			path,
			state,
			value: (tools.get(state, path) ?? "") as string,
		});

		return (
			<PureTextField.Input
				{...rest}
				onBlur={field.setValue}
				onChange={field.setValue}
				value={field.state.value}
			/>
		);
	},
);
TextField.displayName = "TextField";

const TextFieldWithStatics = Object.assign(
	TextField,
	PureTextField,
) as typeof TextField & typeof PureTextField;

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
