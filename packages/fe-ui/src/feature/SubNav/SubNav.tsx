"use client";

import { useNavigationStore } from "@cocrepo/store";
import { cn } from "@heroui/react";
import { icons, type LucideIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useSyncExternalStore } from "react";

function renderLucideIcon(
	iconName?: string,
	className?: string,
	size: number = 16,
) {
	if (!iconName) return null;

	const IconComponent = icons[iconName as keyof typeof icons] as
		| LucideIcon
		| undefined;

	if (!IconComponent) {
		console.warn(`Icon "${iconName}" not found in lucide-react`);
		return null;
	}

	return <IconComponent className={className} size={size} />;
}

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
 * 현재 선택된 아이템의 하위 아이템을 표시합니다.
 *
 * @example
 * ```tsx
 * <Header bottom={<SubNav />} />
 * ```
 */
export const SubNav = observer(() => {
	const navigationStore = useNavigationStore();
	const isMounted = useIsMounted();

	// 하위 아이템은 클라이언트 마운트 후에만 렌더링 (Hydration 오류 방지)
	const subNavItems = isMounted ? navigationStore.subNavItems : [];

	const handleClickSubNavItem = (navItemId: string) => {
		navigationStore.selectSubNavItem(navItemId);
	};

	// 하위 아이템이 없으면 렌더링하지 않음
	if (subNavItems.length === 0) {
		return null;
	}

	return (
		<nav className="border-divider flex items-center gap-1 border-t bg-background/50 px-6 py-2">
			{subNavItems.map((item) => (
				<button
					key={item.id}
					type="button"
					onClick={() => handleClickSubNavItem(item.id)}
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
