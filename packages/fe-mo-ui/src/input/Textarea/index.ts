import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	TextArea as HeroTextArea,
	textAreaClassNames,
} from "heroui-native/text-area";

type HeroTextAreaProps = ComponentPropsWithoutRef<typeof HeroTextArea>;

export interface PureTextareaProps
	extends Omit<
		HeroTextAreaProps,
		"onBlur" | "onChange" | "onChangeText" | "value"
	> {
	onBlur?: (value: string) => void;
	onChange?: (value: string) => void;
	value?: string;
}

const PureTextareaComponent = forwardRef<
	ElementRef<typeof HeroTextArea>,
	PureTextareaProps
>(({ onBlur, onChange, value = "", ...rest }, ref) =>
	createElement(HeroTextArea, {
		...rest,
		onBlur: () => {
			onBlur?.(value);
		},
		onChangeText: onChange,
		ref,
		value,
	}),
);

PureTextareaComponent.displayName = "PureTextarea";

export interface TextareaProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureTextareaProps, "onBlur" | "onChange" | "value"> {}

const TextareaComponent = observer(<TState extends object>(props: TextareaProps<TState>) => {
	const { path, state, ...rest } = props;
	const field = useFormField<TState, string>({
		path,
		state,
		value: (tools.get(state, path) ?? "") as string,
	});

	return createElement(PureTextareaComponent, {
		...rest,
		onBlur: field.setValue,
		onChange: field.setValue,
		value: field.state.value,
	});
});

TextareaComponent.displayName = "Textarea";

export const Textarea = TextareaComponent;
export const TextArea = Textarea;

export { textAreaClassNames };
