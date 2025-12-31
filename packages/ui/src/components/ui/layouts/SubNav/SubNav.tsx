import { Button } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { renderLucideIcon } from "../../../../utils";

/**
 * 하위 메뉴 아이템 인터페이스 (MenuItemStore와 호환)
 */
export interface SubNavMenuItem {
	id: string;
	label: string;
	path?: string;
	icon?: string;
	active: boolean;
}

export interface SubNavProps {
	/** 하위 메뉴 아이템 */
	menuItems: SubNavMenuItem[];
	/** 하위 메뉴 클릭 핸들러 */
	onClickMenu: (menuId: string) => void;
}

/**
 * SubNav 컴포넌트
 * 선택된 주요 메뉴의 하위 메뉴를 표시합니다.
 *
 * 스타일:
 * - 높이: 48px
 * - 배경: gray-50
 * - 선택된 메뉴: Primary color background + white text
 */
export const SubNav = observer<SubNavProps>(({ menuItems, onClickMenu }) => {
	if (!menuItems || menuItems.length === 0) {
		return null;
	}

	return (
		<nav className="flex h-12 items-center gap-2 border-b border-divider bg-default-50 px-6">
			{menuItems.map((menu) => (
				<Button
					key={menu.id}
					variant={menu.active ? "solid" : "light"}
					color={menu.active ? "primary" : "default"}
					size="sm"
					startContent={
						menu.icon ? renderLucideIcon(menu.icon, "w-4 h-4", 16) : undefined
					}
					onPress={() => onClickMenu(menu.id)}
				>
					{menu.label}
				</Button>
			))}
		</nav>
	);
});

SubNav.displayName = "SubNav";
