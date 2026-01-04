"use client";

import { useMenuStore } from "@cocrepo/store";
import { cn } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useSyncExternalStore } from "react";
import { renderLucideIcon } from "../../../utils/iconUtils";

/**
 * 클라이언트 마운트 상태를 추적하는 훅
 * SSR과 클라이언트 초기 렌더링을 일관되게 유지
 */
function useIsMounted(): boolean {
	return useSyncExternalStore(
		() => () => {},
		() => true,
		() => false,
	);
}

/**
 * SubNav Feature 컴포넌트
 * Header의 bottom 영역에 사용
 * 현재 선택된 메뉴의 하위 메뉴를 표시합니다.
 *
 * @example
 * ```tsx
 * <Header bottom={<SubNav />} />
 * ```
 */
export const SubNav = observer(() => {
	const menuStore = useMenuStore();
	const isMounted = useIsMounted();

	// 하위 메뉴는 클라이언트 마운트 후에만 렌더링 (Hydration 오류 방지)
	const subMenuItems = isMounted ? menuStore.subMenuItems : [];

	const handleClickSubMenu = (menuId: string) => {
		menuStore.selectSubMenu(menuId);
	};

	// 하위 메뉴가 없으면 렌더링하지 않음
	if (subMenuItems.length === 0) {
		return null;
	}

	return (
		<nav className="border-divider flex items-center gap-1 border-t bg-background/50 px-6 py-2">
			{subMenuItems.map((item) => (
				<button
					key={item.id}
					type="button"
					onClick={() => handleClickSubMenu(item.id)}
					className={cn(
						"flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
						item.active
							? "bg-default-200 text-foreground"
							: "text-foreground/60 hover:bg-default-100 hover:text-foreground",
					)}
				>
					{item.icon && renderLucideIcon(item.icon, "h-4 w-4", 16)}
					<span>{item.label}</span>
				</button>
			))}
		</nav>
	);
});

SubNav.displayName = "SubNav";
