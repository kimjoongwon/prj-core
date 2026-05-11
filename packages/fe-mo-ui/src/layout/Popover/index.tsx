import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import {
  Popover as HeroPopover,
  popoverClassNames,
  usePopover,
  usePopoverAnimation,
} from "heroui-native/popover";
type HeroPopoverProps = ComponentPropsWithoutRef<typeof HeroPopover>;
export type PopoverProps = HeroPopoverProps & {};
const PopoverComponent = forwardRef<
  ComponentRef<typeof HeroPopover>,
  PopoverProps
>((props, ref) => <HeroPopover {...props} ref={ref} />);
PopoverComponent.displayName = "Popover";
export const Popover = Object.assign(
  PopoverComponent,
  HeroPopover,
) as typeof HeroPopover;
export { popoverClassNames, usePopover, usePopoverAnimation };
