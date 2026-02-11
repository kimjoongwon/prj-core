import type { FABAction, TabConfig } from "@cocrepo/type";
import type { NavItem } from "@cocrepo/store";
import type { ReactNode } from "react";

/**
 * 사용자 정보 타입
 */
export interface AdminUserInfo {
	/**
	 * 사용자 이름
	 */
	name: string;
	/**
	 * 이메일
	 */
	email?: string;
	/**
	 * 아바타 이미지 URL
	 */
	avatarUrl?: string;
	/**
	 * 역할/직책
	 */
	role?: string;
}

/**
 * BottomTab 아이템 인터페이스
 */
export interface BottomTabItem {
	id: string;
	label: string;
	icon: string;
	/** SubMenuList 표시 여부 (children이 있는 경우) */
	hasSubMenu: boolean;
}

/**
 * SubMenu 아이템 인터페이스
 */
export interface SubMenuItem {
	id: string;
	label: string;
	path: string;
}

/**
 * AdminLayout Props (v7.0)
 *
 * NavItem 기반 메뉴 시스템 + 모바일 지원
 */
export interface AdminLayoutProps {
	/** 네비게이션 아이템 (NavItem 배열) */
	navItems: NavItem[];

	/** 현재 선택된 주요 NavItem */
	selectedNavItem: NavItem | null;

	/** 현재 선택된 하위 NavItem */
	selectedSubNavItem: NavItem | null;

	/** 펼쳐진 NavItem ID Set */
	expandedNavItemIds: Set<string>;

	/** 모바일 - BottomTab 아이템 목록 */
	bottomTabItems: BottomTabItem[];

	/** 모바일 - 활성 BottomTab ID */
	activeBottomTabId: string | null;

	/** 모바일 - SubMenuList 열림 상태 */
	isSubMenuOpen: boolean;

	/** 모바일 - SubMenuList 제목 */
	subMenuTitle: string;

	/** 모바일 - SubMenuList 아이템 목록 */
	subMenuItems: NavItem[];

	/** 모바일 - FAB 열림 상태 */
	isFABOpen: boolean;

	/** 모바일 - FAB 액션 목록 */
	fabActions: FABAction[];

	/** 핸들러 - NavItem 클릭 */
	onNavItemClick: (navItemId: string) => void;

	/** 핸들러 - SubNavItem 클릭 */
	onSubNavItemClick: (subNavItemId: string) => void;

	/** 핸들러 - NavItem 토글 (펼침/접힘) */
	onNavItemToggle: (navItemId: string) => void;

	/** 핸들러 - BottomTab 클릭 */
	onBottomTabClick: (tabId: string) => void;

	/** 핸들러 - SubMenuList 닫기 */
	onSubMenuClose: () => void;

	/** 핸들러 - FAB 토글 */
	onFABToggle: () => void;

	/** 핸들러 - FAB 액션 클릭 */
	onFABActionClick: (actionId: string) => void;

	/** 사용자 정보 */
	userInfo?: AdminUserInfo;

	/** 로고 컴포넌트 */
	logo?: ReactNode;

	/** 헤더 오른쪽 영역 (알림, Space 선택 등) */
	headerActions?: ReactNode;

	/** 로그아웃 핸들러 */
	onLogout?: () => void;

	/** 메인 콘텐츠 */
	children: ReactNode;
}

/**
 * AdminSidebar Props (v7.0)
 *
 * 2depth 메뉴 펼침/접힘 지원
 */
export interface AdminSidebarProps {
	/** 네비게이션 아이템 (NavItem 배열) */
	navItems: NavItem[];

	/** 현재 선택된 주요 NavItem */
	selectedNavItem: NavItem | null;

	/** 현재 선택된 하위 NavItem */
	selectedSubNavItem: NavItem | null;

	/** 펼쳐진 NavItem ID Set */
	expandedNavItemIds: Set<string>;

	/** 핸들러 - NavItem 클릭 */
	onNavItemClick: (navItemId: string) => void;

	/** 핸들러 - SubNavItem 클릭 */
	onSubNavItemClick: (subNavItemId: string) => void;

	/** 핸들러 - NavItem 토글 (펼침/접힘) */
	onNavItemToggle: (navItemId: string) => void;

	/** 로고 컴포넌트 */
	logo?: ReactNode;
}

/**
 * AdminHeader Props (v7.0)
 */
export interface AdminHeaderProps {
	/** 사용자 정보 */
	userInfo?: AdminUserInfo;

	/** 오른쪽 영역 (알림, Space 선택 등) */
	actions?: ReactNode;

	/** 로그아웃 핸들러 */
	onLogout?: () => void;

	/** 로고 컴포넌트 (모바일용) */
	logo?: ReactNode;
}

/**
 * AdminBottomTab Props (v7.0 신규)
 */
export interface AdminBottomTabProps {
	/** 탭 아이템 목록 */
	items: BottomTabItem[];

	/** 활성 탭 ID */
	activeTabId: string | null;

	/** 탭 클릭 핸들러 */
	onTabClick: (tabId: string) => void;
}

/**
 * AdminFAB Props (v7.0 신규)
 */
export interface AdminFABProps {
	/** FAB 열림 상태 */
	isOpen: boolean;

	/** FAB 액션 목록 */
	actions: FABAction[];

	/** FAB 토글 핸들러 */
	onToggle: () => void;

	/** FAB 액션 클릭 핸들러 */
	onActionClick: (actionId: string) => void;
}

/**
 * AdminSubMenuList Props (v7.0 신규)
 */
export interface AdminSubMenuListProps {
	/** 제목 */
	title: string;

	/** 서브메뉴 아이템 목록 */
	items: NavItem[];

	/** 선택된 아이템 ID */
	selectedItemId: string | null;

	/** 아이템 클릭 핸들러 */
	onItemClick: (itemId: string) => void;

	/** 닫기 핸들러 */
	onClose: () => void;
}
