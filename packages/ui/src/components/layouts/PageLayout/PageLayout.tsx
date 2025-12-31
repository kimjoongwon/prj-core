import type { ReactNode } from "react";

export interface PageLayoutProps {
	/** 상단 헤더 영역 */
	header?: ReactNode;
	/** 좌측 사이드바 영역 */
	leftAside?: ReactNode;
	/** 우측 사이드바 영역 */
	rightAside?: ReactNode;
	/** 하단 푸터 영역 */
	footer?: ReactNode;
	/** 메인 콘텐츠 영역 */
	children: ReactNode;
}

/**
 * PageLayout 컴포넌트
 * 페이지 전체 구조를 정의하는 순수 레이아웃 컴포넌트 (HTML5 시맨틱)
 * app/(admin)/layout.tsx 등에서 사용
 *
 * 구조:
 * - header: 상단 헤더 영역
 * - leftAside: 좌측 사이드바 영역
 * - rightAside: 우측 사이드바 영역
 * - footer: 하단 푸터 영역
 * - children: 메인 콘텐츠 영역
 *
 * @example
 * ```tsx
 * // app/(admin)/layout.tsx
 * export default function AdminLayout({ children }) {
 *   return (
 *     <PageLayout
 *       header={
 *         <Header
 *           left={<Logo />}
 *           center={<Nav />}
 *           right={<UserMenu />}
 *         />
 *       }
 *       leftAside={<SideMenu />}
 *     >
 *       {children}
 *     </PageLayout>
 *   );
 * }
 * ```
 */
export const PageLayout = ({
	header,
	leftAside,
	rightAside,
	footer,
	children,
}: PageLayoutProps) => {
	return (
		<div className="flex h-screen flex-col bg-background">
			{/* Header 영역 */}
			{header && (
				<header className="sticky top-0 z-40 flex-none">{header}</header>
			)}

			{/* Main Content 영역 */}
			<div className="flex flex-1 overflow-hidden">
				{/* Left Aside 영역 */}
				{leftAside && <aside className="flex-shrink-0">{leftAside}</aside>}

				{/* Children 영역 */}
				<main className="flex-1 overflow-auto">{children}</main>

				{/* Right Aside 영역 */}
				{rightAside && <aside className="flex-shrink-0">{rightAside}</aside>}
			</div>

			{/* Footer 영역 */}
			{footer && <footer className="flex-shrink-0">{footer}</footer>}
		</div>
	);
};

PageLayout.displayName = "PageLayout";
