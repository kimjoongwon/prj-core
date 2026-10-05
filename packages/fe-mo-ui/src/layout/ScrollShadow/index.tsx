import {
	ScrollShadow as HeroScrollShadow,
	scrollShadowClassNames,
} from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
} from "react";

type HeroScrollShadowProps = ComponentPropsWithoutRef<typeof HeroScrollShadow>;
export type ScrollShadowProps = HeroScrollShadowProps & {};
const ScrollShadowComponent = forwardRef<
	ComponentRef<typeof HeroScrollShadow>,
	ScrollShadowProps
>((props, ref) => <HeroScrollShadow {...props} ref={ref} />);
ScrollShadowComponent.displayName = "ScrollShadow";
export const ScrollShadow = Object.assign(
	ScrollShadowComponent,
	HeroScrollShadow,
) as typeof HeroScrollShadow;
export { scrollShadowClassNames };
