import type { ReactNode } from "react";

export interface PageProps {
	/** 페이지 내부 콘텐츠 */
	children: ReactNode;
}

/**
 * Page 컴포넌트
 * children만 받는 페이지 콘텐츠 boundary입니다.
 *
 * @example
 * ```tsx
 * <Page>
 *   <DashboardScreen />
 * </Page>
 * ```
 */
export const Page = ({ children }: PageProps) => {
	return <>{children}</>;
};

Page.displayName = "Page";
