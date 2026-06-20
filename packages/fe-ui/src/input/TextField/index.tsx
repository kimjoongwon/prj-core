"use client";

import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { TextField as BaseTextField } from "./TextField";
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

export const TextField = observer(
	<T extends object>(props: TextFieldProps<T>) => {
		if (!isBoundTextFieldProps(props)) {
			return <BaseTextField {...props} />;
		}

		const {
			state,
			path,
			defaultValue,
			onBlur,
			onChange,
			onValueChange,
			...rest
		} = props;

		const initialValue = tools.get(state, path);
		const stateValue = initialValue === undefined ? defaultValue : initialValue;
		const fallbackValue = stateValue === undefined ? "" : stateValue;

		const formField = useFormField({
			value: fallbackValue as string | number,
			state,
			path,
		});

		const handleChange = (nextValue: string | number) => {
			formField.setValue(nextValue);
			onChange?.(nextValue);
		};

		const handleBlur = (nextValue: string | number) => {
			onBlur?.(nextValue);
		};

		const handleValueChange = (nextValue: string) => {
			onValueChange?.(nextValue);
		};

		return (
			<BaseTextField
				{...rest}
				value={formField.state.value as string | number}
				onBlur={handleBlur}
				onChange={handleChange}
				onValueChange={handleValueChange}
			/>
		);
	},
);

export type { PureTextFieldProps };
