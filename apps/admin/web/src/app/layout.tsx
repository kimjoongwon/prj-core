import { AppModalHost } from "@cocrepo/ui";
import { App } from "@cocrepo/ui/layout";
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
 * App은 전역 content boundary와 portal host를 소유합니다.
 * 인증 전/후 shell은 하위 route layout이 각각 Auth/Admin으로 조립합니다.
 */
export default function ({ children }: { children: React.ReactNode }) {
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
						<App.Content>{children}</App.Content>
						<App.GlobalLayer>
							<AppModalHost />
						</App.GlobalLayer>
						<App.PortalHost />
					</App>
				</Providers>
			</body>
		</html>
	);
}
