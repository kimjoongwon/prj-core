"use client";

import { observer } from "mobx-react-lite";
import { AppIcon } from "../../design-system/icon/AppIcon";
import { useT } from "../../i18n";
import type { BottomNavProps } from "./type";

export const BottomNav = observer(function BottomNav({
	items,
	activeTabId,
	onTabClick,
}: BottomNavProps) {
	const t = useT();
	const handleTabClick = (tabId: string) => {
		onTabClick(tabId);
	};

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
							onClick={() => handleTabClick(item.id)}
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

BottomNav.displayName = "BottomNav";
