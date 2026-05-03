"use client";

import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	Textarea as BaseTextarea,
	type TextareaProps as BaseTextareaProps,
} from "./Textarea";

type BoundTextareaProps<T> = MobxProps<T> &
	Omit<BaseTextareaProps, "value" | "onChange">;

export type TextareaProps<T = object> =
	| BoundTextareaProps<T>
	| BaseTextareaProps;

function isBoundTextareaProps<T>(
	props: TextareaProps<T>,
): props is BoundTextareaProps<T> {
	return "state" in props && "path" in props;
}

export const Textarea = observer(
	<T extends object>(props: TextareaProps<T>) => {
		if (!isBoundTextareaProps(props)) {
			return <BaseTextarea {...props} />;
		}

		const { state, path, ...rest } = props;

		const initialValue = tools.get(state, path, "") as string;

		const formField = useFormField({ value: initialValue, state, path });

		const handleChange = (value: string) => {
			formField.setValue(value);
		};

		return (
			<BaseTextarea
				{...rest}
				value={formField.state.value as string}
				onChange={handleChange}
			/>
		);
	},
);

// Re-export types for backwards compatibility
export type { BaseTextareaProps as PureTextareaProps };
