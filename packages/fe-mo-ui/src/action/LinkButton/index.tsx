import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import {
  LinkButton as HeroLinkButton,
  linkButtonClassNames,
} from "heroui-native";
import { buttonClassNames } from "heroui-native";
import { getTextContent, Text } from "../../data-display/Text";
type HeroLinkButtonProps = ComponentPropsWithoutRef<typeof HeroLinkButton>;
export type LinkButtonProps = HeroLinkButtonProps & {};
const LinkButtonComponent = forwardRef<
  ComponentRef<typeof HeroLinkButton>,
  LinkButtonProps
>(({ children, size = "md", ...props }, ref) => {
  const label = getTextContent(children);

  return (
    <HeroLinkButton {...props} ref={ref} size={size}>
      {label === null ? (
        children
      ) : (
        <Text className={buttonClassNames.label({ size, variant: "ghost" })}>
          {label}
        </Text>
      )}
    </HeroLinkButton>
  );
});
LinkButtonComponent.displayName = "LinkButton";
export const LinkButton = Object.assign(
  LinkButtonComponent,
  HeroLinkButton,
) as typeof HeroLinkButton;
export { linkButtonClassNames };
