"use client";

import { getMyAbilities } from "@cocrepo/api";
import { AbilityProvider, convertApiToRules } from "@cocrepo/hook";
import {
	AppLogo,
	BackButton,
	BottomTab,
	Header,
	PageLayout,
	SideNav,
	SpaceAlert,
	SpaceSelector,
	SubMenuList,
	UserMenu,
} from "@cocrepo/ui";
import { useCallback, useState } from "react";
import { useSpaceGuard } from "@/hooks";

/**
 * Admin 레이아웃
 * /admin/* 경로의 페이지에 PageLayout을 적용합니다.
 * (단, /admin/auth/*, /admin/select-space 제외)
 *
 * 계층 구조:
 * - AppLayout (app/layout.tsx) - children만, body 래퍼
 *     - PageLayout (여기) - header, leftAside, rightAside, footer
 *         - SectionLayout (하위 layout.tsx들) - top, left, right, bottom
 *
 * 데스크톱 레이아웃 (>= 768px):
 * +------------------+----------------------------------------------------------+
 * |      [Logo]      |                                   [Space▼] [Avatar▼]    |
 * +------------------+----------------------------------------------------------+
 * |                  |                                                          |
 * |    SideNav       |                     children                             |
 * |    (leftAside)   |                     (Main)                               |
 * |                  |                                                          |
 * +------------------+----------------------------------------------------------+
 *
 * 모바일 레이아웃 (< 768px):
 * +------------------------------------------------------------------------+
 * | [뒤로] [Logo]                              [Space▼] [Avatar▼]         |
 * +------------------------------------------------------------------------+
 * |                                                                        |
 * |                        children (Main)                                 |
 * |                        또는                                            |
 * |                     SubMenuList (전체 화면)                            |
 * |                                                                        |
 * +------------------------------------------------------------------------+
 * | [대시보드] [회원] [예약] [알림] [설정]    <- BottomTab                  |
 * +------------------------------------------------------------------------+
 *
 * Feature 컴포넌트가 자체적으로 비즈니스 로직을 처리합니다:
 * - AppLogo: 클릭 시 첫 번째 메뉴로 이동 (NavigationStore 사용)
 * - SideNav: 2depth 트리 메뉴 표시 및 선택 (NavigationStore 사용) - 데스크톱 전용
 * - BottomTab: 1depth 메뉴 표시 (NavigationStore 사용) - 모바일 전용
 * - SubMenuList: 2depth 메뉴 표시 (NavigationStore 사용) - 모바일 전용
 * - BackButton: 서브메뉴에서 뒤로가기 - 모바일 전용
 * - SpaceSelector: Space 변경 기능 (PersistStore 사용)
 * - UserMenu: 사용자 정보 표시, 로그아웃 (AuthStore, PersistStore 사용)
 */
export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { showAlert, handleConfirm, handleDismiss } = useSpaceGuard();
	const [showSubMenuList, setShowSubMenuList] = useState(false);

	// 서버에서 권한 정보를 가져오는 함수
	const fetchAbilities = useCallback(async () => {
		const response = await getMyAbilities();
		return convertApiToRules(response.data ?? []);
	}, []);

	// BottomTab 선택 핸들러
	const handleSelectTab = (_menuId: string, hasChildren: boolean) => {
		if (hasChildren) {
			// 하위 메뉴가 있으면 SubMenuList 표시
			setShowSubMenuList(true);
		} else {
			// 하위 메뉴 없으면 SubMenuList 숨김
			setShowSubMenuList(false);
		}
	};

	// SubMenuList에서 하위 메뉴 선택 시
	const handleSelectSubMenu = () => {
		// 하위 메뉴 선택 후 SubMenuList 닫기
		setShowSubMenuList(false);
	};

	// SubMenuList에서 뒤로가기
	const handleBackFromSubMenu = () => {
		setShowSubMenuList(false);
	};

	return (
		<AbilityProvider fetchAbilities={fetchAbilities}>
			<PageLayout
				header={
					<Header
						left={
							<>
								{/* 모바일에서 SubMenuList 표시 시 뒤로가기 버튼 */}
								{showSubMenuList && (
									<div className="md:hidden">
										<BackButton onClick={handleBackFromSubMenu} iconOnly />
									</div>
								)}
								<AppLogo icon="LayoutGrid" text="Admin" />
							</>
						}
						right={
							<>
								<SpaceSelector />
								<UserMenu />
							</>
						}
					/>
				}
				leftAside={<SideNav />}
			>
				{children}

				{/* 모바일: SubMenuList (전체 화면) */}
				{showSubMenuList && (
					<SubMenuList onSelectSubNavItem={handleSelectSubMenu} />
				)}

				{/* 모바일: BottomTab (하단 탭 네비게이션) */}
				<BottomTab onSelectTab={handleSelectTab} />

				{/* Space 미선택 Alert */}
				{showAlert && (
					<SpaceAlert
						title="Space 선택 필요"
						message="서비스 이용을 위해 Space를 선택해주세요."
						onConfirm={handleConfirm}
						onDismiss={handleDismiss}
					/>
				)}
			</PageLayout>
		</AbilityProvider>
	);
}
