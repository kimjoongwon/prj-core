"use client";

import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	TextArea as PureTextArea,
	type TextAreaProps as PureTextAreaProps,
} from "./TextArea";

type BoundTextAreaProps<T> = MobxProps<T> &
	Omit<PureTextAreaProps, "value" | "onChange">;

export type TextAreaProps<T = object> =
	| BoundTextAreaProps<T>
	| PureTextAreaProps;

function isBoundTextAreaProps<T>(
	props: TextAreaProps<T>,
): props is BoundTextAreaProps<T> {
	return "state" in props && "path" in props;
}

const TextArea = observer(<T extends object>(props: TextAreaProps<T>) => {
	if (!isBoundTextAreaProps(props)) {
		return <PureTextArea {...props} />;
	}

	const { state, path, ...rest } = props;

	const initialValue = tools.get(state, path, "") as string;

	const formField = useFormField({ value: initialValue, state, path });

	const handleChange = (value: string) => {
		formField.setValue(value);
	};

	return (
		<PureTextArea
			{...rest}
			value={formField.state.value as string}
			onChange={handleChange}
		/>
	);
});

export { TextArea };
export type { PureTextAreaProps };
