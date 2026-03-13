"use client";
import { useLogout } from "@cocrepo/api/idp/auth";

import { useLayout } from "@cocrepo/hook";
import {
	useConsoleBottomTabStore,
	useConsoleFABStore,
	useConsoleNavigationStore,
} from "@cocrepo/store";
import {
	ActionFab,
	AppLogo,
	BottomNav,
	HeaderBar,
	Layout,
	OverlayMenu,
	SidePanel,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";

interface ConsoleLayoutWrapperProps {
	children: ReactNode;
}

/**
 * IDP 관리 콘솔 레이아웃
 *
 * Layout 조합을 적용합니다.
 * - Space 선택 UI 없음 (IDP는 시스템 전체 관리)
 * - JWT 인증 체크 (미인증 시 /auth/login으로 리다이렉트)
 */
function ConsoleLayoutWrapper({ children }: ConsoleLayoutWrapperProps) {
	const layoutProps = useLayout({
		useNavigationStore: useConsoleNavigationStore,
		useBottomTabStore: useConsoleBottomTabStore,
		useFABStore: useConsoleFABStore,
	});

	const userInfo = {
		name: "IDP 관리자",
		role: "FULL_ACCESS",
	};

	const { mutate: logoutMutate } = useLogout({
		mutation: {
			onSettled: () => {
				window.location.href = "/auth/login";
			},
		},
	});

	const handleLogout = () => {
		logoutMutate();
	};

	return (
		<Layout
			header={
				<HeaderBar
					userInfo={userInfo}
					onLogout={handleLogout}
					logo={<AppLogo icon="KeyRound" text="IDP 관리" />}
				/>
			}
			sidebar={
				<SidePanel
					navItems={layoutProps.navItems}
					selectedNavItem={layoutProps.selectedNavItem}
					selectedSubNavItem={layoutProps.selectedSubNavItem}
					expandedNavItemIds={layoutProps.expandedNavItemIds}
					onNavItemClick={layoutProps.onNavItemClick}
					onSubNavItemClick={layoutProps.onSubNavItemClick}
					onNavItemToggle={layoutProps.onNavItemToggle}
					logo={<AppLogo icon="KeyRound" text="IDP 관리" />}
				/>
			}
			mobileOverlayMenu={
				layoutProps.isSubMenuOpen ? (
					<OverlayMenu
						title={layoutProps.subMenuTitle}
						items={layoutProps.subMenuItems}
						selectedItemId={layoutProps.selectedSubNavItem?.id ?? null}
						onItemClick={layoutProps.onSubNavItemClick}
						onClose={layoutProps.onSubMenuClose}
					/>
				) : undefined
			}
			mobileFab={
				layoutProps.fabActions.length > 0 ? (
					<ActionFab
						isOpen={layoutProps.isFABOpen}
						actions={layoutProps.fabActions}
						onToggle={layoutProps.onFABToggle}
						onActionClick={layoutProps.onFABActionClick}
					/>
				) : undefined
			}
			mobileBottomNav={
				<BottomNav
					items={layoutProps.bottomTabItems}
					activeTabId={layoutProps.activeBottomTabId}
					onTabClick={layoutProps.onBottomTabClick}
				/>
			}
		>
			{children}
		</Layout>
	);
}

export default observer(ConsoleLayoutWrapper);
