"use client";

import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	TextArea as BaseTextArea,
	type TextAreaProps as BaseTextAreaProps,
} from "./TextArea";

type BoundTextAreaProps<T> = MobxProps<T> &
	Omit<BaseTextAreaProps, "value" | "onChange">;

export type TextAreaProps<T = object> =
	| BoundTextAreaProps<T>
	| BaseTextAreaProps;

function isBoundTextAreaProps<T>(
	props: TextAreaProps<T>,
): props is BoundTextAreaProps<T> {
	return "state" in props && "path" in props;
}

export const TextArea = observer(
	<T extends object>(props: TextAreaProps<T>) => {
		if (!isBoundTextAreaProps(props)) {
			return <BaseTextArea {...props} />;
		}

		const { state, path, ...rest } = props;

		const initialValue = tools.get(state, path, "") as string;

		const formField = useFormField({ value: initialValue, state, path });

		const handleChange = (value: string) => {
			formField.setValue(value);
		};

		return (
			<BaseTextArea
				{...rest}
				value={formField.state.value as string}
				onChange={handleChange}
			/>
		);
	},
);

// Re-export types for backwards compatibility
export type { BaseTextAreaProps as PureTextAreaProps };
