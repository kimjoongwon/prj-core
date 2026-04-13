import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import {
	CloseButton as HeroCloseButton,
	closeButtonClassNames,
} from "heroui-native/close-button";

type HeroCloseButtonProps = ComponentPropsWithoutRef<typeof HeroCloseButton>;

export type CloseButtonProps = HeroCloseButtonProps & {};

const CloseButtonComponent = forwardRef<
	ElementRef<typeof HeroCloseButton>,
	CloseButtonProps
>((props, ref) => createElement(HeroCloseButton, { ...props, ref }));

CloseButtonComponent.displayName = "CloseButton";

export const CloseButton = Object.assign(
	CloseButtonComponent,
	HeroCloseButton,
) as typeof HeroCloseButton;

export { closeButtonClassNames };
