import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import {
	LinkButton as HeroLinkButton,
	linkButtonClassNames,
} from "heroui-native/link-button";

type HeroLinkButtonProps = ComponentPropsWithoutRef<typeof HeroLinkButton>;

export type LinkButtonProps = HeroLinkButtonProps & {};

const LinkButtonComponent = forwardRef<
	ElementRef<typeof HeroLinkButton>,
	LinkButtonProps
>((props, ref) => createElement(HeroLinkButton, { ...props, ref }));

LinkButtonComponent.displayName = "LinkButton";

export const LinkButton = Object.assign(
	LinkButtonComponent,
	HeroLinkButton,
) as typeof HeroLinkButton;

export { linkButtonClassNames };
