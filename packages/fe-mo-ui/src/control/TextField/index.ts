import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import {
	TextField as HeroTextField,
	textFieldClassNames,
	useTextField,
} from "heroui-native/text-field";

type HeroTextFieldProps = ComponentPropsWithoutRef<typeof HeroTextField>;

export type TextFieldProps = HeroTextFieldProps & {};

const TextFieldComponent = forwardRef<
	ElementRef<typeof HeroTextField>,
	TextFieldProps
>((props, ref) => createElement(HeroTextField, { ...props, ref }));

TextFieldComponent.displayName = "TextField";

export const TextField = Object.assign(
	TextFieldComponent,
	HeroTextField,
) as typeof HeroTextField;

export { textFieldClassNames, useTextField };
