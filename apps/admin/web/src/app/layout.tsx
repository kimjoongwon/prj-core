import { App } from "@cocrepo/ui";
import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
	title: "Admin",
	description: "Admin Dashboard",
};

/**
 * 루트 레이아웃
 * App은 children만 받으며 순수하게 body를 감쌉니다.
 *
 * 계층 구조:
 * - App (app/layout.tsx) - children만, body 래퍼
 *     - Page (app/(admin)/layout.tsx) - header, leftAside, rightAside, footer
 *         - Section (하위 layout.tsx들) - top, left, right, bottom
 */
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ko">
			<head>
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
				/>
			</head>
			<body>
				<Providers>
					<App>{children}</App>
				</Providers>
			</body>
		</html>
	);
}
