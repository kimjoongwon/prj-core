import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import {
  Button as HeroButton,
  buttonClassNames,
  useButton,
} from "heroui-native/button";
type HeroButtonProps = ComponentPropsWithoutRef<typeof HeroButton>;
export type ButtonProps = HeroButtonProps & {};
const ButtonComponent = forwardRef<
  ComponentRef<typeof HeroButton>,
  ButtonProps
>((props, ref) => <HeroButton {...props} ref={ref} />);
ButtonComponent.displayName = "Button";
export const Button = Object.assign(
  ButtonComponent,
  HeroButton,
) as typeof HeroButton;
export { buttonClassNames, useButton };
