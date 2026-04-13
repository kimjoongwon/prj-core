import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
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

const MenuComponent = forwardRef<ElementRef<typeof HeroMenu>, MenuProps>(
	(props, ref) => createElement(HeroMenu, { ...props, ref }),
);

MenuComponent.displayName = "Menu";

export const Menu = Object.assign(MenuComponent, HeroMenu) as typeof HeroMenu;

export { menuClassNames, useMenu, useMenuAnimation, useMenuItem };
