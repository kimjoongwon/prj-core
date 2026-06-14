import type { ReactNode } from "react";

export interface AppProps {
	/** 상단 header 영역 */
	header?: ReactNode;
	/** 좌측 aside 영역 */
	leftAside?: ReactNode;
	/** 우측 aside 영역 */
	rightAside?: ReactNode;
	/** 중심 main 영역 */
	main: ReactNode;
	/** 하단 footer 영역 */
	footer?: ReactNode;
}

/**
 * App 컴포넌트
 * Next.js 최상위 layout.tsx에서만 사용하는 루트 body 래퍼
 * header/footer/leftAside/rightAside/main 구조 슬롯을 소유합니다.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="ko">
 *       <body>
 *         <App header={<TopBar />} main={children} />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export const App = ({
	header,
	leftAside,
	rightAside,
	main,
	footer,
}: AppProps) => {
	return (
		<div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
			{header ? <header className="shrink-0">{header}</header> : null}
			<div className="flex min-h-0 w-full flex-1">
				{leftAside ? (
					<aside className="hidden h-full w-64 flex-none md:block">
						{leftAside}
					</aside>
				) : null}
				<main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-surface-secondary p-4 pb-20 md:p-6 md:pb-6">
					{main}
				</main>
				{rightAside ? (
					<aside className="hidden h-full w-80 flex-none xl:block">
						{rightAside}
					</aside>
				) : null}
			</div>
			{footer ? <footer className="shrink-0">{footer}</footer> : null}
		</div>
	);
};

App.displayName = "App";
