import {
	AccessGate,
	App,
	AppBody,
	AppFooter,
	AppHeader,
	AppLeftAside,
	AppMain,
	FloatingAction,
	MobileBottomNavigation,
	MobileMenu,
	SideNavigation,
	TopBar,
} from "@cocrepo/ui";
import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
	title: "Admin",
	description: "Admin Dashboard",
};

export const dynamic = "force-dynamic";

/**
 * 루트 레이아웃
 * App은 root의 header/footer/aside/main 구조 슬롯을 소유합니다.
 *
 * 계층 구조:
 * - App (app/layout.tsx) - body wrapper
 *     - app/layout.tsx - route layout 직접 조립
 */
export default function ({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ko" suppressHydrationWarning>
			<head>
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
				/>
			</head>
			<body className="bg-background text-foreground">
				<Providers>
					<App>
						<AppHeader>
							<TopBar />
						</AppHeader>
						<AppBody>
							<AppLeftAside>
								<SideNavigation />
							</AppLeftAside>
							<AppMain>
								<AccessGate contents={children} />
							</AppMain>
						</AppBody>
						<AppFooter>
							<MobileMenu />
							<FloatingAction />
							<MobileBottomNavigation />
						</AppFooter>
					</App>
				</Providers>
			</body>
		</html>
	);
}
