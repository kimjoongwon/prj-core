import {
	ScrollShadow as HeroScrollShadow,
	scrollShadowVariants,
	useScrollShadow,
} from "@heroui/react";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
} from "react";

type HeroScrollShadowProps = ComponentPropsWithoutRef<typeof HeroScrollShadow>;
export type ScrollShadowProps = HeroScrollShadowProps & {};
export type {
	ScrollShadowRootProps,
	ScrollShadowVariants,
	ScrollShadowVisibility,
	UseScrollShadowProps,
} from "@heroui/react";
export { scrollShadowVariants, useScrollShadow };

const ScrollShadowComponent = forwardRef<
	ComponentRef<typeof HeroScrollShadow>,
	ScrollShadowProps
>((props, ref) => <HeroScrollShadow {...props} ref={ref} />);
ScrollShadowComponent.displayName = "ScrollShadow";
export const ScrollShadow = Object.assign(
	ScrollShadowComponent,
	HeroScrollShadow,
) as typeof HeroScrollShadow;
