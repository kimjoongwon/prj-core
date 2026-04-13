import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { Separator as HeroSeparator, separatorClassNames } from "heroui-native/separator";

type HeroSeparatorProps = ComponentPropsWithoutRef<typeof HeroSeparator>;

export type SeparatorProps = HeroSeparatorProps & {};

const SeparatorComponent = forwardRef<
	ElementRef<typeof HeroSeparator>,
	SeparatorProps
>((props, ref) => createElement(HeroSeparator, { ...props, ref }));

SeparatorComponent.displayName = "Separator";

export const Separator = Object.assign(
	SeparatorComponent,
	HeroSeparator,
) as typeof HeroSeparator;

export { separatorClassNames };
