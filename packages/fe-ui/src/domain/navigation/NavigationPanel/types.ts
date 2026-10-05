import type { NavItem } from "@cocrepo/store";
import type { ReactNode } from "react";

export type NavigationPanelDensity = "comfortable" | "compact";
export type NavigationPanelDescriptionVisibility =
	| "always"
	| "active"
	| "hidden";

export interface NavigationPanelSubItemProps {
	item: NavItem;
	isSelected: boolean;
	density: NavigationPanelDensity;
	onItemClick: (itemId: string) => void;
}

export interface NavigationPanelItemProps {
	item: NavItem;
	isSelected: boolean;
	isActiveBranch: boolean;
	isExpanded: boolean;
	selectedSubItemId: string | null;
	onNavItemClick: (navItemId: string) => void;
	onSubNavItemClick: (subNavItemId: string) => void;
	onToggle: (navItemId: string) => void;
	density: NavigationPanelDensity;
	descriptionVisibility: NavigationPanelDescriptionVisibility;
	renderItemIcon?: (item: NavItem, state: { isSelected: boolean }) => ReactNode;
	getItemDescription?: (item: NavItem) => ReactNode;
}
