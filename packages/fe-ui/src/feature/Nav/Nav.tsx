"use client";

import { useNavigationStore } from "@cocrepo/store";
import { cn, NavbarItem } from "@heroui/react";
import { icons, type LucideIcon } from "lucide-react";
import { observer } from "mobx-react-lite";

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
 * Nav Feature 컴포넌트
 * Header의 center 영역에 사용
 * NavigationStore를 사용하여 네비게이션 상태를 관리합니다.
 *
 * @example
 * ```tsx
 * <Header center={<Nav />} />
 * ```
 */
export const Nav = observer(() => {
	const navigationStore = useNavigationStore();

	const handleClickNavItem = (navItemId: string) => {
		navigationStore.selectNavItem(navItemId);
	};

	return (
		<nav className="flex items-center gap-1">
			{navigationStore.items.map((item) => (
				<NavbarItem key={item.id}>
					<button
						type="button"
						onClick={() => handleClickNavItem(item.id)}
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
