import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import {
  SubMenu as HeroSubMenu,
  subMenuClassNames,
  useSubMenu,
} from "heroui-native/sub-menu";
type HeroSubMenuProps = ComponentPropsWithoutRef<typeof HeroSubMenu>;
export type SubMenuProps = HeroSubMenuProps & {};
const SubMenuComponent = forwardRef<
  ComponentRef<typeof HeroSubMenu>,
  SubMenuProps
>((props, ref) => <HeroSubMenu {...props} ref={ref} />);
SubMenuComponent.displayName = "SubMenu";
export const SubMenu = Object.assign(
  SubMenuComponent,
  HeroSubMenu,
) as typeof HeroSubMenu;
export { subMenuClassNames, useSubMenu };
