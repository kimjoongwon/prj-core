import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import {
  Menu as HeroMenu,
  menuClassNames,
  useMenu,
  useMenuAnimation,
  useMenuItem,
} from "heroui-native/menu";
type HeroMenuProps = ComponentPropsWithoutRef<typeof HeroMenu>;
export type MenuProps = HeroMenuProps & {};
const MenuComponent = forwardRef<ComponentRef<typeof HeroMenu>, MenuProps>(
  (props, ref) => <HeroMenu {...props} ref={ref} />,
);
MenuComponent.displayName = "Menu";
export const Menu = Object.assign(MenuComponent, HeroMenu) as typeof HeroMenu;
export { menuClassNames, useMenu, useMenuAnimation, useMenuItem };
