import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { observer } from "mobx-react-lite";
import { Input as HeroInput, inputClassNames } from "heroui-native/input";
import { type MobxProps, useMobxField } from "../../internal/useMobxField";

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
	const field = useMobxField({ fallback: "", path, state });

	return createElement(PureInputComponent, {
		...rest,
		onBlur: field.setValue,
		onChange: field.setValue,
		value: field.value,
	});
});

InputComponent.displayName = "Input";

export const Input = InputComponent;

export { inputClassNames };
