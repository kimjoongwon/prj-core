"use client";

import { useNavigationStore } from "@cocrepo/store";
import { cn } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { AppIcon } from "../../design-system/icon/AppIcon";

/**
 * SubNav Feature 컴포넌트
 * Header의 bottom 영역에 사용
 * 현재 선택된 아이템의 하위 아이템을 표시합니다.
 *
 * @example
 * ```tsx
 * <Header bottom={<SubNav />} />
 * ```
 */
export const SubNav = observer(() => {
	const navigationStore = useNavigationStore();
	const subNavItems = navigationStore.subNavItems;

	const handleClickSubNavItem = (navItemId: string) => {
		navigationStore.selectSubNavItem(navItemId);
	};

	// 하위 아이템이 없으면 렌더링하지 않음
	if (subNavItems.length === 0) {
		return null;
	}

	return (
		<nav className="border-border flex items-center gap-1 border-t bg-background/50 px-6 py-2">
			{subNavItems.map((item) => (
				<button
					key={item.id}
					type="button"
					onClick={() => handleClickSubNavItem(item.id)}
					className={cn(
						"flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
						item.active
							? "bg-default text-foreground"
							: "text-foreground/60 hover:bg-default hover:text-foreground",
					)}
				>
					{item.icon && (
						<AppIcon name={item.icon} className="h-4 w-4" size={16} />
					)}
					<span>{item.label}</span>
				</button>
			))}
		</nav>
	);
});

SubNav.displayName = "SubNav";
