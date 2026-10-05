"use client";

import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { useFormValidationField } from "../../form/Form";
import { TextField as PureTextField } from "./TextField";
import type { TextFieldProps as PureTextFieldProps } from "./TextField.props";

type BoundTextFieldProps<T> = MobxProps<T> &
	Omit<PureTextFieldProps, "value"> & {
		/** @deprecated direct value is managed by form field state when bound */
		value?: never;
	};

export type TextFieldProps<T = object> =
	| BoundTextFieldProps<T>
	| PureTextFieldProps;

function isBoundTextFieldProps<T>(
	props: TextFieldProps<T>,
): props is BoundTextFieldProps<T> {
	return "state" in props && "path" in props;
}

const TextField = observer(<T extends object>(props: TextFieldProps<T>) => {
	if (!isBoundTextFieldProps(props)) {
		return <PureTextField {...props} />;
	}

	const {
		state,
		path,
		defaultValue,
		errorMessage,
		isDisabled,
		isInvalid,
		isReadOnly,
		onBlur,
		onChange,
		onFocus,
		onValueChange,
		...rest
	} = props;
	const fieldPath = String(path);

	const initialValue = tools.get(state, path);
	const stateValue = initialValue === undefined ? defaultValue : initialValue;
	const fallbackValue = stateValue === undefined ? "" : stateValue;
	const validation = useFormValidationField(fieldPath);

	const formField = useFormField({
		value: fallbackValue as string | number,
		state,
		path,
	});

	const handleChange = (nextValue: string | number) => {
		formField.setValue(nextValue);
		validation.validate("onChange", nextValue);
		onChange?.(nextValue);
	};

	const handleBlur = (nextValue: string | number) => {
		validation.validate("onBlur", nextValue);
		onBlur?.(nextValue);
	};

	const handleFocus = (nextValue: string | number) => {
		validation.validate("onFocus", nextValue);
		onFocus?.(nextValue);
	};

	const handleValueChange = (nextValue: string) => {
		onValueChange?.(nextValue);
	};

	return (
		<PureTextField
			{...rest}
			errorMessage={errorMessage ?? validation.errorMessage}
			isDisabled={isDisabled ?? validation.readOnly}
			isInvalid={isInvalid ?? validation.isInvalid}
			isReadOnly={isReadOnly ?? validation.readOnly}
			value={formField.state.value as string | number}
			onBlur={handleBlur}
			onChange={handleChange}
			onFocus={handleFocus}
			onValueChange={handleValueChange}
		/>
	);
});

export { TextField };
export type { PureTextFieldProps };
