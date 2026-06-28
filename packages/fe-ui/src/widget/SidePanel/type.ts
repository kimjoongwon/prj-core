import type { NavItem } from "@cocrepo/store";
import type { ReactNode } from "react";

export interface SidePanelProps {
	navItems: NavItem[];
	selectedNavItem: NavItem | null;
	selectedSubNavItem: NavItem | null;
	expandedNavItemIds: Set<string>;
	onNavItemClick: (navItemId: string) => void;
	onSubNavItemClick: (subNavItemId: string) => void;
	onNavItemToggle: (navItemId: string) => void;
	header?: ReactNode;
	logo?: ReactNode;
	logoDescription?: ReactNode;
	footer?: ReactNode;
	className?: string;
	density?: "comfortable" | "compact";
	descriptionVisibility?: "always" | "active" | "hidden";
	renderItemIcon?: (item: NavItem, state: { isSelected: boolean }) => ReactNode;
	getItemDescription?: (item: NavItem) => ReactNode;
}
