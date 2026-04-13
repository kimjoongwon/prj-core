import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { SubMenu as HeroSubMenu, subMenuClassNames, useSubMenu } from "heroui-native/sub-menu";

type HeroSubMenuProps = ComponentPropsWithoutRef<typeof HeroSubMenu>;

export type SubMenuProps = HeroSubMenuProps & {};

const SubMenuComponent = forwardRef<ElementRef<typeof HeroSubMenu>, SubMenuProps>(
	(props, ref) => createElement(HeroSubMenu, { ...props, ref }),
);

SubMenuComponent.displayName = "SubMenu";

export const SubMenu = Object.assign(
	SubMenuComponent,
	HeroSubMenu,
) as typeof HeroSubMenu;

export { subMenuClassNames, useSubMenu };
