"use client";

import { useLayout } from "@cocrepo/hook";
import type { AppIconName } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { AppIcon } from "../../design-system/icon/AppIcon";
import { useT } from "../../i18n";

interface BottomNavItem {
	id: string;
	label: string;
	icon: AppIconName;
	hasSubMenu: boolean;
}

interface BottomNavigationBarProps {
	items: BottomNavItem[];
	activeTabId: string | null;
	onTabClick: (tabId: string) => void;
}

const BottomNavigationBar = observer(function BottomNavigationBar({
	items,
	activeTabId,
	onTabClick,
}: BottomNavigationBarProps) {
	const t = useT();

	return (
		<nav className="fixed inset-x-0 bottom-0 z-40 border-border border-t bg-surface md:hidden">
			<div className="flex h-16 items-stretch justify-around">
				{items.map((item) => {
					const isActive = activeTabId === item.id;

					return (
						<button
							key={item.id}
							type="button"
							className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
								isActive ? "text-accent" : "text-muted hover:text-foreground"
							}`}
							onClick={() => onTabClick(item.id)}
							aria-current={isActive ? "page" : undefined}
						>
							<span className="flex h-6 w-6 items-center justify-center">
								<AppIcon
									name={item.icon}
									className={isActive ? "text-accent" : "text-muted"}
									size={24}
								/>
							</span>
							<span
								className={`text-xs ${isActive ? "font-medium" : "font-normal"}`}
							>
								{t(item.label)}
							</span>
						</button>
					);
				})}
			</div>
			<div className="h-safe-area-inset-bottom bg-surface" />
		</nav>
	);
});

/**
 * mobile bottom navigation을 store 상태에 연결해 렌더링합니다.
 */
export const MobileBottomNavigation = observer(
	function MobileBottomNavigation() {
		const layoutProps = useLayout();

		return (
			<BottomNavigationBar
				items={layoutProps.bottomTabItems}
				activeTabId={layoutProps.activeBottomTabId}
				onTabClick={layoutProps.onBottomTabClick}
			/>
		);
	},
);
