"use client";

import { type AppStore, useApp } from "@cocrepo/store";
import type { UseLayoutOptions, UseLayoutReturn } from "@cocrepo/type";

export type { UseLayoutOptions, UseLayoutReturn } from "@cocrepo/type";

/**
 * useLayout
 *
 * 앱 전역 상태 컨테이너에서 레이아웃 바인딩 데이터를 조합해 반환합니다.
 *
 * @example
 * ```tsx
 * const layoutProps = useLayout();
 * ```
 */
export function useLayout(
	_options?: UseLayoutOptions,
): UseLayoutReturn<AppStore> {
	const app = useApp();
	const sideNavigation = app.ui.body.leftAside.sideNavigation;
	const mobileBottomNavigation = app.ui.footer.mobileBottomNavigation;
	const mobileMenu = app.ui.footer.mobileMenu;
	const floatingAction = app.ui.footer.floatingAction;

	// 핸들러
	const handleNavItemClick = (navItemId: string) => {
		sideNavigation.selectItem(navItemId);
	};

	const handleSubNavItemClick = (subNavItemId: string) => {
		sideNavigation.selectSubItem(subNavItemId);
		// OverlayMenu에서 선택 시 닫기
		mobileMenu.close();
	};

	const handleNavItemToggle = (navItemId: string) => {
		sideNavigation.toggleItem(navItemId);
	};

	const handleBottomTabClick = (tabId: string) => {
		mobileBottomNavigation.selectItem(tabId);
	};

	const handleSubMenuClose = () => {
		mobileMenu.close();
	};

	const handleFABToggle = () => {
		floatingAction.toggle();
	};

	const handleFABActionClick = (actionId: string) => {
		floatingAction.execute(actionId);
	};

	return {
		// 네비게이션 데이터
		navItems: sideNavigation.items,
		selectedNavItem: sideNavigation.selectedItem,
		selectedSubNavItem: sideNavigation.selectedSubItem,
		expandedNavItemIds: sideNavigation.expandedItemIds,

		// 모바일 - BottomTab
		bottomTabItems: mobileBottomNavigation.items,
		activeBottomTabId: mobileBottomNavigation.activeItemId,

		// 모바일 - SubMenuList
		isSubMenuOpen: mobileMenu.isOpen,
		subMenuTitle: mobileMenu.title,
		subMenuItems: mobileMenu.items,

		// 모바일 - FAB
		isFABOpen: floatingAction.isOpen,
		fabActions: floatingAction.actions,

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
