"use client";

import { AppLayout } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";

import { useAdminLayout } from "../hooks/useAdminLayout";

interface AdminLayoutWrapperProps {
	children: ReactNode;
}

/**
 * AdminLayoutWrapper 컴포넌트
 *
 * AppLayout을 사용하여 어드민 레이아웃을 제공합니다.
 * AbilityProvider와 AdminStoreProvider는 providers.tsx에서 최상단 제공됩니다.
 *
 * 사용:
 * - /admin/* 경로의 모든 페이지에서 사용 (단, /admin/select-space 제외)
 */
export const AdminLayoutWrapper = observer<AdminLayoutWrapperProps>(
	({ children }) => {
		const {
			menuItems,
			subMenuItems,
			currentContext,
			currentUser,
			onClickMenu,
			onClickSubMenu,
			onChangeContext,
			onLogout,
			onClickLogo,
		} = useAdminLayout();

		return (
			<AppLayout
				menuItems={menuItems}
				subMenuItems={subMenuItems}
				currentUser={currentUser}
				currentContext={currentContext}
				onClickMenu={onClickMenu}
				onClickSubMenu={onClickSubMenu}
				onChangeContext={onChangeContext}
				onLogout={onLogout}
				onClickLogo={onClickLogo}
				logoIcon="LayoutGrid"
				logoText="Admin"
				changeContextText="Ground 변경"
			>
				{children}
			</AppLayout>
		);
	},
);

AdminLayoutWrapper.displayName = "AdminLayoutWrapper";
