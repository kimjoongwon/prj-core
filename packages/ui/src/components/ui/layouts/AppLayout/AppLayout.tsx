import type { ReactNode } from "react";

export interface AppLayoutProps {
	/** 상단 헤더 영역 (Header 컴포넌트) */
	header?: ReactNode;
	/** 하위 네비게이션 영역 (SubNav 컴포넌트) */
	subNav?: ReactNode;
	/** 사이드바 영역 */
	sidebar?: ReactNode;
	/** 페이지 콘텐츠 */
	children: ReactNode;
}

/**
 * AppLayout 컴포넌트
 * 영역만 정의하는 순수 레이아웃 컴포넌트
 *
 * 구조:
 * - header: 상단 헤더 영역 (Header 컴포넌트)
 * - subNav: 하위 네비게이션 영역
 * - sidebar: 사이드바 영역
 * - children: 메인 콘텐츠 영역
 *
 * @example
 * ```tsx
 * <AppLayout
 *   header={
 *     <Header
 *       logo={<Logo icon="LayoutGrid" text="Admin" onClick={onClickLogo} />}
 *       rightContent={<UserMenu user={currentUser} onLogout={onLogout} />}
 *     >
 *       <Nav items={menuItems} onClickMenu={onClickMenu} />
 *     </Header>
 *   }
 *   subNav={<SubNav items={subMenuItems} onClickMenu={onClickSubMenu} />}
 * >
 *   <PageContent />
 * </AppLayout>
 * ```
 */
export const AppLayout = ({
	header,
	subNav,
	sidebar,
	children,
}: AppLayoutProps) => {
	return (
		<div className="flex h-screen flex-col bg-background">
			{/* Header 영역 */}
			{header && <div className="sticky top-0 z-40 flex-none">{header}</div>}

			{/* Sub Navigation 영역 */}
			{subNav}

			{/* Main Content 영역 */}
			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar 영역 */}
				{sidebar && <aside className="flex-shrink-0">{sidebar}</aside>}

				{/* Content 영역 */}
				<main className="flex flex-1 flex-col overflow-hidden bg-content2">
					<div className="scrollbar-thin flex-1 overflow-y-auto">
						<div className="p-6">{children}</div>
					</div>
				</main>
			</div>
		</div>
	);
};

AppLayout.displayName = "AppLayout";
