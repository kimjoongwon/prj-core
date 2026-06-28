import type { AppIconName } from "@cocrepo/type";

export interface BottomNavItem {
	id: string;
	label: string;
	icon: AppIconName;
	hasSubMenu: boolean;
}

export interface BottomNavProps {
	items: BottomNavItem[];
	activeTabId: string | null;
	onTabClick: (tabId: string) => void;
}
