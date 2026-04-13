import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import {
	Button as HeroButton,
	buttonClassNames,
	useButton,
} from "heroui-native/button";

type HeroButtonProps = ComponentPropsWithoutRef<typeof HeroButton>;

export type ButtonProps = HeroButtonProps & {};

const ButtonComponent = forwardRef<ElementRef<typeof HeroButton>, ButtonProps>(
	(props, ref) => createElement(HeroButton, { ...props, ref }),
);

ButtonComponent.displayName = "Button";

export const Button = Object.assign(ButtonComponent, HeroButton) as typeof HeroButton;

export { buttonClassNames, useButton };
