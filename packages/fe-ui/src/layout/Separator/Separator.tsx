import {
	Separator as HeroSeparator,
	separatorVariants,
} from "@heroui/react";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
} from "react";

type HeroSeparatorProps = ComponentPropsWithoutRef<typeof HeroSeparator>;
export type SeparatorProps = HeroSeparatorProps & {};
export type { SeparatorRootProps, SeparatorVariants } from "@heroui/react";
export { separatorVariants };

const SeparatorComponent = forwardRef<
	ComponentRef<typeof HeroSeparator>,
	SeparatorProps
>((props, ref) => <HeroSeparator {...props} ref={ref} />);
SeparatorComponent.displayName = "Separator";
export const Separator = Object.assign(
	SeparatorComponent,
	HeroSeparator,
) as typeof HeroSeparator;
