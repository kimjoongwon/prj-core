"use client";

import { useNavigationStore } from "@cocrepo/store";
import { cn, NavbarItem } from "@cocrepo/ui/heroui";
import { observer } from "mobx-react-lite";
import { AppIcon } from "../../design-system/icon/AppIcon";
import { useT } from "../../i18n";

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
	const t = useT();
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
						{item.icon && (
							<AppIcon name={item.icon} className="h-4 w-4" size={16} />
						)}
						<span>{t(item.label)}</span>
					</button>
				</NavbarItem>
			))}
		</nav>
	);
});

Nav.displayName = "Nav";
