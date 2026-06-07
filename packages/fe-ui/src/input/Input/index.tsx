"use client";

import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { Input as BaseInput, type InputProps as BaseInputProps } from "./Input";

type BoundInputProps<T> = MobxProps<T> &
	Omit<BaseInputProps, "value" | "onChange" | "onBlur">;

export type InputProps<T = object> = BoundInputProps<T> | BaseInputProps;

function isBoundInputProps<T>(
	props: InputProps<T>,
): props is BoundInputProps<T> {
	return "state" in props && "path" in props;
}

export const Input = observer(<T extends object>(props: InputProps<T>) => {
	if (!isBoundInputProps(props)) {
		return <BaseInput {...props} />;
	}

	const { path, state, ...rest } = props;

	const initialValue = (tools.get(state, path) as string | number) || "";

	const formField = useFormField({ value: initialValue, state, path });

	const handleChange = (value: string | number) => {
		formField.setValue(value);
	};

	const handleBlur = (value: string | number) => {
		formField.setValue(value);
	};

	return (
		<BaseInput
			{...rest}
			value={formField.state.value as string | number}
			onChange={handleChange}
			onBlur={handleBlur}
		/>
	);
});

// Re-export types for backwards compatibility
export type { BaseInputProps as PureInputProps };
