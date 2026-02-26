"use client";

import { useGetMySpaces, useLogout } from "@cocrepo/api";
import type { SpaceInfo } from "@cocrepo/ui";
import {
	AdminLayout,
	AppLogo,
	HeaderSpaceSelector,
	renderLucideIcon,
} from "@cocrepo/ui";
import { Button, Tooltip } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { type ReactNode, useEffect } from "react";
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

	// Space 목록 조회 및 PersistStore에 저장
	const { data: mySpacesResponse } = useGetMySpaces();

	useEffect(() => {
		const spaces = mySpacesResponse?.data;
		if (!spaces || spaces.length === 0) return;

		const spaceInfoList: SpaceInfo[] = spaces
			.filter((space) => space.ground)
			.map((space) => ({
				spaceId: space.id,
				groundName: space.ground!.name,
			}));

		persistStore.setSpaces(spaceInfoList);
	}, [mySpacesResponse, persistStore]);

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

	const handleOpenIdpClient = () => {
		const idpClientUrl = process.env.NEXT_PUBLIC_IDP_CLIENT_URL;
		if (idpClientUrl) {
			window.open(idpClientUrl, "_blank");
		}
	};

	return (
		<AdminLayout
			{...layoutProps}
			logo={<AppLogo icon="LayoutGrid" text="플레이트" />}
			headerActions={
				<>
					<Tooltip content="IDP 관리" placement="bottom">
						<Button
							variant="light"
							isIconOnly
							size="sm"
							aria-label="IDP 관리 콘솔 열기"
							onPress={handleOpenIdpClient}
						>
							{renderLucideIcon("KeyRound", "w-5 h-5 text-default-500", 20)}
						</Button>
					</Tooltip>
					<HeaderSpaceSelector
						spaces={persistStore.spaces}
						currentSpaceId={persistStore.spaceId}
						currentSpaceName={persistStore.groundName}
						onSpaceSelect={handleSpaceSelect}
					/>
				</>
			}
			userInfo={userInfo}
			onLogout={handleLogout}
		>
			{children}
		</AdminLayout>
	);
}

export default observer(AdminLayoutWrapper);
