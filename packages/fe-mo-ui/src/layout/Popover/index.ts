import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import {
	Popover as HeroPopover,
	popoverClassNames,
	usePopover,
	usePopoverAnimation,
} from "heroui-native/popover";

type HeroPopoverProps = ComponentPropsWithoutRef<typeof HeroPopover>;

export type PopoverProps = HeroPopoverProps & {};

const PopoverComponent = forwardRef<ElementRef<typeof HeroPopover>, PopoverProps>(
	(props, ref) => createElement(HeroPopover, { ...props, ref }),
);

PopoverComponent.displayName = "Popover";

export const Popover = Object.assign(
	PopoverComponent,
	HeroPopover,
) as typeof HeroPopover;

export { popoverClassNames, usePopover, usePopoverAnimation };
