"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	PureTextarea,
	type PureTextareaProps,
	textAreaClassNames,
} from "./Textarea";

export interface TextareaProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureTextareaProps, "onBlur" | "onChange" | "value"> {}

const Textarea = observer(
	<TState extends object>(props: TextareaProps<TState>) => {
		const { path, state, ...rest } = props;
		const field = useFormField<TState, string>({
			path,
			state,
			value: (tools.get(state, path) ?? "") as string,
		});

		return (
			<PureTextarea
				{...rest}
				onBlur={field.setValue}
				onChange={field.setValue}
				value={field.state.value}
			/>
		);
	},
);
Textarea.displayName = "Textarea";

const TextareaWithStatics = Object.assign(Textarea, {
	Description: PureTextarea.Description,
	Error: PureTextarea.Error,
	FieldError: PureTextarea.FieldError,
	Label: PureTextarea.Label,
}) as typeof Textarea & {
	Description: typeof PureTextarea.Description;
	Error: typeof PureTextarea.Error;
	FieldError: typeof PureTextarea.FieldError;
	Label: typeof PureTextarea.Label;
};
const TextArea = TextareaWithStatics;

export { TextareaWithStatics as Textarea, TextArea };
export { textAreaClassNames };
export type { PureTextareaProps };
