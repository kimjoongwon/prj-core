"use client";

import { AdminLayout, AppLogo } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { HeaderSpaceSelector } from "@/components/features";
import { useAdminLayout, useSpaceGuard } from "@/hooks";

interface AdminLayoutWrapperProps {
	children: ReactNode;
}

/**
 * Admin 레이아웃 래퍼
 *
 * v7.0 AdminLayout을 적용합니다.
 * - 데스크톱: Header + Sidebar (항상 펼침) + Main
 * - 모바일: Header + Main + BottomTab + FAB
 */
function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
	const layoutProps = useAdminLayout();

	// Space 선택 여부 검사 및 리다이렉트
	useSpaceGuard();

	// 사용자 정보 (추후 AuthStore에서 가져올 수 있음)
	const userInfo = {
		name: "관리자",
		role: "Owner",
	};

	// 로그아웃 핸들러
	const handleLogout = () => {
		// TODO: 로그아웃 로직 구현
		console.log("로그아웃");
	};

	return (
		<AdminLayout
			{...layoutProps}
			logo={<AppLogo icon="LayoutGrid" text="플레이트" />}
			headerActions={<HeaderSpaceSelector />}
			userInfo={userInfo}
			onLogout={handleLogout}
		>
			{children}
		</AdminLayout>
	);
}

export default observer(AdminLayoutWrapper);
