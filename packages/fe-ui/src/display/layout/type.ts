import type { NavItem } from "@cocrepo/store";
import type { AppIconName, FABAction } from "@cocrepo/type";
import type { ReactNode } from "react";

/**
 * HeaderBar 사용자 정보 타입
 */
export interface LayoutUserInfo {
	name: string;
	email?: string;
	avatarUrl?: string;
	role?: string;
}

/**
 * BottomNav 아이템
 */
export interface BottomNavItem {
	id: string;
	label: string;
	icon: AppIconName;
	/** OverlayMenu 표시 여부 (children이 있는 경우) */
	hasSubMenu: boolean;
}

/**
 * Layout 슬롯 기반 Props
 */
export interface LayoutProps {
	header?: ReactNode;
	sidebar?: ReactNode;
	mobileBottomNav?: ReactNode;
	mobileFab?: ReactNode;
	mobileOverlayMenu?: ReactNode;
	desktopVariant?: "inline-sidebar" | "stacked-header";
	className?: string;
	bodyClassName?: string;
	sidebarClassName?: string;
	mainClassName?: string;
	children: ReactNode;
}

/**
 * SidePanel Props
 */
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
	renderItemIcon?: (
		item: NavItem,
		state: { isSelected: boolean },
	) => ReactNode;
	getItemDescription?: (item: NavItem) => ReactNode;
}

/**
 * HeaderBar Props
 */
export interface HeaderBarProps {
	userInfo?: LayoutUserInfo;
	actions?: ReactNode;
	onLogout?: () => void;
	logo?: ReactNode;
	leading?: ReactNode;
	context?: ReactNode;
	className?: string;
	renderUserMenu?: (params: {
		userInfo: LayoutUserInfo;
		onLogout?: () => void;
	}) => ReactNode;
}

/**
 * BottomNav Props
 */
export interface BottomNavProps {
	items: BottomNavItem[];
	activeTabId: string | null;
	onTabClick: (tabId: string) => void;
}

/**
 * ActionFab Props
 */
export interface ActionFabProps {
	isOpen: boolean;
	actions: FABAction[];
	onToggle: () => void;
	onActionClick: (actionId: string) => void;
}

/**
 * OverlayMenu Props
 */
export interface OverlayMenuProps {
	title: string;
	items: NavItem[];
	selectedItemId: string | null;
	onItemClick: (itemId: string) => void;
	onClose: () => void;
}
