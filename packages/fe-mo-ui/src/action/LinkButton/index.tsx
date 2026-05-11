import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import {
  LinkButton as HeroLinkButton,
  linkButtonClassNames,
} from "heroui-native/link-button";
type HeroLinkButtonProps = ComponentPropsWithoutRef<typeof HeroLinkButton>;
export type LinkButtonProps = HeroLinkButtonProps & {};
const LinkButtonComponent = forwardRef<
  ComponentRef<typeof HeroLinkButton>,
  LinkButtonProps
>((props, ref) => <HeroLinkButton {...props} ref={ref} />);
LinkButtonComponent.displayName = "LinkButton";
export const LinkButton = Object.assign(
  LinkButtonComponent,
  HeroLinkButton,
) as typeof HeroLinkButton;
export { linkButtonClassNames };
