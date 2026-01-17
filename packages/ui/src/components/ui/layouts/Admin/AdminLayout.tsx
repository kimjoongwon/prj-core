"use client";

import { observer } from "mobx-react-lite";
import { AdminBottomTab } from "./AdminBottomTab";
import { AdminFAB } from "./AdminFAB";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { AdminSubMenuList } from "./AdminSubMenuList";
import type { AdminLayoutProps } from "./types";

/**
 * AdminLayout - 관리자 페이지 레이아웃 (v7.0)
 *
 * 기획서 참조: 01-desktop.md, 02-mobile.md
 *
 * 반응형 레이아웃:
 * - 데스크톱 (>= md): Header + Sidebar (항상 펼침) + Main
 * - 모바일 (< md): Header + Main + BottomTab + FAB + SubMenuList
 *
 * @example
 * ```tsx
 * <AdminLayout
 *   navItems={navigationStore.items}
 *   currentPath={pathname}
 *   selectedNavItem={navigationStore.selectedNavItem}
 *   selectedSubNavItem={navigationStore.selectedSubNavItem}
 *   bottomTabItems={bottomTabStore.tabItems}
 *   activeBottomTabId={bottomTabStore.activeTabId}
 *   isSubMenuOpen={bottomTabStore.isSubMenuOpen}
 *   subMenuTitle={bottomTabStore.subMenuTitle}
 *   subMenuItems={bottomTabStore.subMenuItems}
 *   isFABOpen={fabStore.isOpen}
 *   fabActions={fabStore.visibleActions}
 *   onNavItemClick={(id) => navigationStore.selectNavItem(id)}
 *   onSubNavItemClick={(id) => navigationStore.selectSubNavItem(id)}
 *   onBottomTabClick={(id) => bottomTabStore.selectTab(id)}
 *   onSubMenuClose={() => bottomTabStore.closeSubMenu()}
 *   onFABToggle={() => fabStore.toggle()}
 *   onFABActionClick={(id) => fabStore.executeAction(id)}
 *   userInfo={userInfo}
 *   logo={<Logo />}
 *   headerActions={<HeaderActions />}
 *   onLogout={handleLogout}
 * >
 *   <PageContent />
 * </AdminLayout>
 * ```
 */
export const AdminLayout = observer(function AdminLayout({
	navItems,
	selectedNavItem,
	selectedSubNavItem,
	expandedNavItemIds,
	bottomTabItems,
	activeBottomTabId,
	isSubMenuOpen,
	subMenuTitle,
	subMenuItems,
	isFABOpen,
	fabActions,
	onNavItemClick,
	onSubNavItemClick,
	onNavItemToggle,
	onBottomTabClick,
	onSubMenuClose,
	onFABToggle,
	onFABActionClick,
	userInfo,
	logo,
	headerActions,
	onLogout,
	children,
}: AdminLayoutProps) {
	return (
		<div className="flex h-screen bg-background">
			{/* 데스크톱 사이드바 (md 이상에서만 표시) */}
			<div className="hidden md:block">
				<AdminSidebar
					navItems={navItems}
					selectedNavItem={selectedNavItem}
					selectedSubNavItem={selectedSubNavItem}
					expandedNavItemIds={expandedNavItemIds}
					onNavItemClick={onNavItemClick}
					onSubNavItemClick={onSubNavItemClick}
					onNavItemToggle={onNavItemToggle}
					logo={logo}
				/>
			</div>

			{/* 메인 컨텐츠 영역 */}
			<div className="flex flex-1 flex-col overflow-hidden">
				{/* 헤더 */}
				<AdminHeader
					userInfo={userInfo}
					actions={headerActions}
					onLogout={onLogout}
					logo={logo}
				/>

				{/* 메인 컨텐츠 */}
				<main className="flex-1 overflow-y-auto bg-content2 p-4 pb-20 md:p-6 md:pb-6">
					{children}
				</main>
			</div>

			{/* 모바일 전용 UI (md 미만에서만 표시) */}

			{/* SubMenuList 오버레이 */}
			{isSubMenuOpen && (
				<AdminSubMenuList
					title={subMenuTitle}
					items={subMenuItems}
					selectedItemId={selectedSubNavItem?.id ?? null}
					onItemClick={onSubNavItemClick}
					onClose={onSubMenuClose}
				/>
			)}

			{/* FAB */}
			{fabActions.length > 0 && (
				<AdminFAB
					isOpen={isFABOpen}
					actions={fabActions}
					onToggle={onFABToggle}
					onActionClick={onFABActionClick}
				/>
			)}

			{/* BottomTab */}
			<AdminBottomTab
				items={bottomTabItems}
				activeTabId={activeBottomTabId}
				onTabClick={onBottomTabClick}
			/>
		</div>
	);
});

AdminLayout.displayName = "AdminLayout";
