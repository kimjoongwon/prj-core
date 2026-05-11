import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import {
  CloseButton as HeroCloseButton,
  closeButtonClassNames,
} from "heroui-native/close-button";
type HeroCloseButtonProps = ComponentPropsWithoutRef<typeof HeroCloseButton>;
export type CloseButtonProps = HeroCloseButtonProps & {};
const CloseButtonComponent = forwardRef<
  ComponentRef<typeof HeroCloseButton>,
  CloseButtonProps
>((props, ref) => <HeroCloseButton {...props} ref={ref} />);
CloseButtonComponent.displayName = "CloseButton";
export const CloseButton = Object.assign(
  CloseButtonComponent,
  HeroCloseButton,
) as typeof HeroCloseButton;
export { closeButtonClassNames };
