"use client";

import { useLogout } from "@cocrepo/api";
import type { SpaceInfo } from "@cocrepo/ui";
import { AdminLayout, AppLogo, HeaderSpaceSelector } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { useAdminLayout, useSpaceGuard } from "@/hooks";
import { usePersistStore } from "@/stores/AppStoreProvider";

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
	const persistStore = usePersistStore();

	// Space 선택 여부 검사 및 리다이렉트
	useSpaceGuard();

	// 사용자 정보 (추후 AuthStore에서 가져올 수 있음)
	const userInfo = {
		name: "관리자",
		role: "Owner",
	};

	// 로그아웃
	const { mutate: logoutMutate } = useLogout({
		mutation: {
			onSettled: () => {
				persistStore.clearSpace();
				window.location.href = "/admin/auth/login";
			},
		},
	});

	const handleLogout = () => {
		logoutMutate();
	};

	// Space 선택 핸들러
	const handleSpaceSelect = (space: SpaceInfo) => {
		persistStore.setSpace(space.spaceId, space.groundName);
		// 페이지 리로드하여 새로운 X-Space-ID 헤더 적용
		window.location.reload();
	};

	return (
		<AdminLayout
			{...layoutProps}
			logo={<AppLogo icon="LayoutGrid" text="플레이트" />}
			headerActions={
				<HeaderSpaceSelector
					spaces={persistStore.spaces}
					currentSpaceId={persistStore.spaceId}
					currentSpaceName={persistStore.groundName}
					onSpaceSelect={handleSpaceSelect}
				/>
			}
			userInfo={userInfo}
			onLogout={handleLogout}
		>
			{children}
		</AdminLayout>
	);
}

export default observer(AdminLayoutWrapper);
