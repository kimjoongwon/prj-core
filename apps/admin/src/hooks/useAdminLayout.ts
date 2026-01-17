"use client";

import {
	useBottomTabStore,
	useFABStore,
	useNavigationStore,
} from "../stores/AppStoreProvider";

/**
 * useAdminLayout - AdminLayout v7.0 통합 훅
 *
 * NavigationStore, BottomTabStore, FABStore의 데이터와 핸들러를
 * AdminLayout props 형태로 반환합니다.
 *
 * @example
 * ```tsx
 * function AdminLayoutWrapper({ children }) {
 *   const layoutProps = useAdminLayout();
 *   return <AdminLayout {...layoutProps}>{children}</AdminLayout>;
 * }
 * ```
 */
export function useAdminLayout() {
	const navigationStore = useNavigationStore();
	const bottomTabStore = useBottomTabStore();
	const fabStore = useFABStore();

	// 핸들러
	const handleNavItemClick = (navItemId: string) => {
		navigationStore.selectNavItem(navItemId);
	};

	const handleSubNavItemClick = (subNavItemId: string) => {
		navigationStore.selectSubNavItem(subNavItemId);
		// SubMenuList에서 선택 시 닫기
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
