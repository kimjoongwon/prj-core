"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import type { MobxProps, Paths } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import {
	PureTextarea,
	type PureTextareaProps,
	textAreaClassNames,
} from "./Textarea";
import { useRegisterInputState } from "../input-state-inspection";

type BoundTextareaProps<TState extends object> = MobxProps<TState> &
	(Omit<PureTextareaProps, "onBlur" | "onChange" | "value"> & {
		value?: never;
		defaultValue?: string;
		onChange?: PureTextareaProps["onChange"];
		onBlur?: PureTextareaProps["onBlur"];
	});
type UnboundTextareaProps = Omit<
	PureTextareaProps,
	"onBlur" | "onChange" | "value"
> & {
	state?: never;
	path?: never;
	value?: string;
	defaultValue?: string;
	onChange?: PureTextareaProps["onChange"];
	onBlur?: PureTextareaProps["onBlur"];
};
export type TextareaProps<TState extends object = Record<string, unknown>> =
	| BoundTextareaProps<TState>
	| UnboundTextareaProps;
export function createTextareaState(value = "") {
	const state = {
		value,
		setValue(nextValue: string) {
			state.value = nextValue;
		},
	};
	return makeAutoObservable(
		state,
		{},
		{ autoBind: true, name: "TextareaState" },
	);
}
export type TextareaState = ReturnType<typeof createTextareaState>;

const Textarea = observer(
	<TState extends object>(props: TextareaProps<TState>) => {
		const {
			defaultValue,
			onBlur,
			onChange,
			path,
			state,
			value: controlledValue,
			...rest
		} = props;
		const localState = useLocalObservable(() =>
			createTextareaState(defaultValue ?? ""),
		);
		const field = useFormField<TState, string>({
			path: (state && path ? path : "value") as Paths<TState, 4>,
			state: (state ?? localState) as TState,
			defaultValue: defaultValue ?? "",
		});
		const isBound = state !== undefined && path !== undefined;
		const isControlled = !isBound && controlledValue !== undefined;
		useRegisterInputState(
			() => (isControlled ? controlledValue : field.state.value),
			isControlled ? controlledValue : field.state.value,
		);

		return (
			<PureTextarea
				{...rest}
				onBlur={(nextValue) => {
					if (!isControlled) field.setValue(nextValue);
					onBlur?.(nextValue);
				}}
				onChange={(nextValue) => {
					if (!isControlled) field.setValue(nextValue);
					onChange?.(nextValue);
				}}
				value={isControlled ? controlledValue : field.state.value}
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
