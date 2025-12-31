import { Button } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { renderLucideIcon } from "../../../../utils";

/**
 * 메뉴 아이템 인터페이스
 */
export interface NavMenuItem {
	id: string;
	label: string;
	icon?: string;
	active: boolean;
}

export interface NavProps {
	/** 메뉴 아이템 목록 */
	items: NavMenuItem[];
	/** 메뉴 클릭 핸들러 */
	onClickMenu: (menuId: string) => void;
}

/**
 * Nav 컴포넌트
 * Header의 children으로 사용하는 네비게이션 메뉴
 *
 * @example
 * ```tsx
 * <Header logo={<Logo />} rightContent={<UserMenu />}>
 *   <Nav items={menuItems} onClickMenu={onClickMenu} />
 * </Header>
 * ```
 */
export const Nav = observer<NavProps>(({ items, onClickMenu }) => {
	return (
		<div className="hidden gap-1 sm:flex">
			{items.map((menu) => (
				<Button
					key={menu.id}
					variant={menu.active ? "flat" : "light"}
					color={menu.active ? "primary" : "default"}
					size="sm"
					startContent={renderLucideIcon(menu.icon, "h-4 w-4", 16)}
					onPress={() => onClickMenu(menu.id)}
				>
					{menu.label}
				</Button>
			))}
		</div>
	);
});

Nav.displayName = "Nav";
