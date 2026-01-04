"use client";

import { useMenuStore } from "@cocrepo/store";
import { cn, NavbarItem } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { renderLucideIcon } from "../../../utils/iconUtils";

/**
 * Nav Feature 컴포넌트
 * Header의 center 영역에 사용
 * MenuStore를 사용하여 메뉴 상태를 관리합니다.
 *
 * @example
 * ```tsx
 * <Header center={<Nav />} />
 * ```
 */
export const Nav = observer(() => {
	const menuStore = useMenuStore();

	const handleClickMenu = (menuId: string) => {
		menuStore.selectMenu(menuId);
	};

	return (
		<nav className="flex items-center gap-1">
			{menuStore.items.map((item) => (
				<NavbarItem key={item.id}>
					<button
						type="button"
						onClick={() => handleClickMenu(item.id)}
						className={cn(
							"flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
							item.active
								? "bg-primary text-primary-foreground"
								: "text-foreground/70 hover:bg-default-100 hover:text-foreground",
						)}
					>
						{item.icon && renderLucideIcon(item.icon, "h-4 w-4", 16)}
						<span>{item.label}</span>
					</button>
				</NavbarItem>
			))}
		</nav>
	);
});

Nav.displayName = "Nav";
