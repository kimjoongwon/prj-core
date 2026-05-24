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
import { getTextContent, Text } from "../../data-display/Text";
type HeroButtonProps = ComponentPropsWithoutRef<typeof HeroButton>;
export type ButtonProps = HeroButtonProps & {};
const ButtonComponent = forwardRef<
  ComponentRef<typeof HeroButton>,
  ButtonProps
>(({ children, size = "md", variant = "primary", ...props }, ref) => {
  const label = getTextContent(children);

  return (
    <HeroButton {...props} ref={ref} size={size} variant={variant}>
      {label === null ? (
        children
      ) : (
        <Text className={buttonClassNames.label({ size, variant })}>
          {label}
        </Text>
      )}
    </HeroButton>
  );
});
ButtonComponent.displayName = "Button";
export const Button = Object.assign(
  ButtonComponent,
  HeroButton,
) as typeof HeroButton;
export { buttonClassNames, useButton };
