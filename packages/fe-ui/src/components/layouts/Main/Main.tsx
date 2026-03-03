import type { ReactNode } from "react";

export interface MainProps {
	children: ReactNode;
	className?: string;
}

/**
 * Main 컴포넌트
 * SEO를 위한 시맨틱 main 태그를 제공하는 컴포넌트
 *
 * @example
 * ```tsx
 * <AppShell header={<Header />}>
 *   <Main>{children}</Main>
 * </AppShell>
 * ```
 */
export const Main = ({ children, className }: MainProps) => {
	return (
		<main
			className={`flex flex-1 flex-col overflow-hidden bg-content2 ${className ?? ""}`}
		>
			<div className="scrollbar-thin flex-1 overflow-y-auto">
				<div className="p-6">{children}</div>
			</div>
		</main>
	);
};

Main.displayName = "Main";
