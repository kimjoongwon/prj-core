"use client";

import {
	AppLogo,
	ContextSelector,
	Header,
	PageLayout,
	SideNav,
	SpaceAlert,
	UserMenu,
} from "@cocrepo/ui";
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
 * 레이아웃 구조:
 * +------------------+----------------------------------------------------------+
 * |      [Logo]      |                                   [Space▼] [Avatar▼]    |
 * +------------------+----------------------------------------------------------+
 * |                  |                                                          |
 * |    SideNav       |                     children                             |
 * |    (leftAside)   |                     (Main)                               |
 * |                  |                                                          |
 * +------------------+----------------------------------------------------------+
 *
 * Feature 컴포넌트가 자체적으로 비즈니스 로직을 처리합니다:
 * - AppLogo: 클릭 시 첫 번째 메뉴로 이동 (MenuStore 사용)
 * - SideNav: 2depth 트리 메뉴 표시 및 선택 (MenuStore 사용)
 * - ContextSelector: Space 변경 기능 (PersistStore 사용)
 * - UserMenu: 사용자 정보 표시, 로그아웃 (AuthStore, PersistStore 사용)
 */
export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { showAlert, handleConfirm, handleDismiss } = useSpaceGuard();

	return (
		<PageLayout
			header={
				<Header
					left={<AppLogo icon="LayoutGrid" text="Admin" />}
					right={
						<>
							<ContextSelector changeText="Space 변경" />
							<UserMenu />
						</>
					}
				/>
			}
			leftAside={<SideNav />}
		>
			{children}

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
	);
}
