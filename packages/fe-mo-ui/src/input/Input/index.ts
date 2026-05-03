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
import { Input as HeroInput, inputClassNames } from "heroui-native/input";

type HeroInputProps = ComponentPropsWithoutRef<typeof HeroInput>;

export interface PureInputProps
	extends Omit<HeroInputProps, "onBlur" | "onChange" | "onChangeText" | "value"> {
	onBlur?: (value: string) => void;
	onChange?: (value: string) => void;
	value?: string;
}

const PureInputComponent = forwardRef<ElementRef<typeof HeroInput>, PureInputProps>(
	({ onBlur, onChange, value = "", ...rest }, ref) =>
		createElement(HeroInput, {
			...rest,
			onBlur: () => {
				onBlur?.(value);
			},
			onChangeText: onChange,
			ref,
			value,
		}),
);

PureInputComponent.displayName = "PureInput";

export interface InputProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureInputProps, "onBlur" | "onChange" | "value"> {}

const InputComponent = observer(<TState extends object>(props: InputProps<TState>) => {
	const { path, state, ...rest } = props;
	const field = useFormField<TState, string>({
		path,
		state,
		value: (tools.get(state, path) ?? "") as string,
	});

	return createElement(PureInputComponent, {
		...rest,
		onBlur: field.setValue,
		onChange: field.setValue,
		value: field.state.value,
	});
});

InputComponent.displayName = "Input";

export const Input = InputComponent;

export { inputClassNames };
