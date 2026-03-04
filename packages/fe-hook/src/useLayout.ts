"use client";

import type { BottomTabStore, FABStore, NavigationStore } from "@cocrepo/store";

/**
 * useLayout 옵션 인터페이스
 */
export interface UseLayoutOptions {
	useNavigationStore: () => NavigationStore;
	useBottomTabStore: () => BottomTabStore;
	useFABStore: () => FABStore;
}

/**
 * useLayout 반환 타입
 */
export interface UseLayoutReturn {
	// 네비게이션 데이터
	navItems: NavigationStore["items"];
	selectedNavItem: NavigationStore["selectedNavItem"];
	selectedSubNavItem: NavigationStore["selectedSubNavItem"];
	expandedNavItemIds: NavigationStore["expandedNavItemIds"];

	// 모바일 - BottomTab
	bottomTabItems: BottomTabStore["tabItems"];
	activeBottomTabId: BottomTabStore["activeTabId"];

	// 모바일 - SubMenuList
	isSubMenuOpen: BottomTabStore["isSubMenuOpen"];
	subMenuTitle: BottomTabStore["subMenuTitle"];
	subMenuItems: BottomTabStore["subMenuItems"];

	// 모바일 - FAB
	isFABOpen: FABStore["isOpen"];
	fabActions: FABStore["visibleActions"];

	// 핸들러
	onNavItemClick: (navItemId: string) => void;
	onSubNavItemClick: (subNavItemId: string) => void;
	onNavItemToggle: (navItemId: string) => void;
	onBottomTabClick: (tabId: string) => void;
	onSubMenuClose: () => void;
	onFABToggle: () => void;
	onFABActionClick: (actionId: string) => void;
}

/**
 * useLayout
 *
 * 앱별 Store selector hooks를 주입받아
 * 레이아웃 바인딩 데이터를 조합해 반환합니다.
 *
 * @example
 * ```tsx
 * import { useLayout } from "@cocrepo/hook";
 * import { useBottomTabStore, useFABStore, useNavigationStore } from "@/stores/AppStoreProvider";
 *
 * const layoutProps = useLayout({
 *   useNavigationStore,
 *   useBottomTabStore,
 *   useFABStore,
 * });
 * ```
 */
export function useLayout(options: UseLayoutOptions): UseLayoutReturn {
	const { useNavigationStore, useBottomTabStore, useFABStore } = options;

	const navigationStore = useNavigationStore();
	const bottomTabStore = useBottomTabStore();
	const fabStore = useFABStore();

	// 핸들러
	const handleNavItemClick = (navItemId: string) => {
		navigationStore.selectNavItem(navItemId);
	};

	const handleSubNavItemClick = (subNavItemId: string) => {
		navigationStore.selectSubNavItem(subNavItemId);
		// OverlayMenu에서 선택 시 닫기
		bottomTabStore.closeSubMenu();
	};

	const handleNavItemToggle = (navItemId: string) => {
		navigationStore.toggleNavItem(navItemId);
	};

	const handleBottomTabClick = (tabId: string) => {
		bottomTabStore.selectTab(tabId);
	};

	const handleSubMenuClose = () => {
		bottomTabStore.closeSubMenu();
	};

	const handleFABToggle = () => {
		fabStore.toggle();
	};

	const handleFABActionClick = (actionId: string) => {
		fabStore.executeAction(actionId);
	};

	return {
		// 네비게이션 데이터
		navItems: navigationStore.items,
		selectedNavItem: navigationStore.selectedNavItem,
		selectedSubNavItem: navigationStore.selectedSubNavItem,
		expandedNavItemIds: navigationStore.expandedNavItemIds,

		// 모바일 - BottomTab
		bottomTabItems: bottomTabStore.tabItems,
		activeBottomTabId: bottomTabStore.activeTabId,

		// 모바일 - SubMenuList
		isSubMenuOpen: bottomTabStore.isSubMenuOpen,
		subMenuTitle: bottomTabStore.subMenuTitle,
		subMenuItems: bottomTabStore.subMenuItems,

		// 모바일 - FAB
		isFABOpen: fabStore.isOpen,
		fabActions: fabStore.visibleActions,

		// 핸들러
		onNavItemClick: handleNavItemClick,
		onSubNavItemClick: handleSubNavItemClick,
		onNavItemToggle: handleNavItemToggle,
		onBottomTabClick: handleBottomTabClick,
		onSubMenuClose: handleSubMenuClose,
		onFABToggle: handleFABToggle,
		onFABActionClick: handleFABActionClick,
	};
}
