"use client";

import { useFormField } from "@cocrepo/hook";
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

const BoundTextArea = observer(<T extends object>(props: BoundTextAreaProps<T>) => {

	const { state, path, ...rest } = props;

	const formField = useFormField({ defaultValue: "", state, path });

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

const TextArea = <T extends object>(props: TextAreaProps<T>) =>
	isBoundTextAreaProps(props) ? <BoundTextArea {...props} /> : <PureTextArea {...props} />;

export type { TextAreaState } from "./TextArea";
export { createTextAreaState } from "./TextArea";
export type { PureTextAreaProps };
export { TextArea };
