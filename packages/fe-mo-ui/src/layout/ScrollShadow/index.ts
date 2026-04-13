import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import {
	ScrollShadow as HeroScrollShadow,
	scrollShadowClassNames,
} from "heroui-native/scroll-shadow";

type HeroScrollShadowProps = ComponentPropsWithoutRef<typeof HeroScrollShadow>;

export type ScrollShadowProps = HeroScrollShadowProps & {};

const ScrollShadowComponent = forwardRef<
	ElementRef<typeof HeroScrollShadow>,
	ScrollShadowProps
>((props, ref) => createElement(HeroScrollShadow, { ...props, ref }));

ScrollShadowComponent.displayName = "ScrollShadow";

export const ScrollShadow = Object.assign(
	ScrollShadowComponent,
	HeroScrollShadow,
) as typeof HeroScrollShadow;

export { scrollShadowClassNames };
