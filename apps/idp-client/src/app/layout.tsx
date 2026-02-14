import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
	title: "Identity Provider 관리",
	description: "OIDC Identity Provider 관리 콘솔",
};

/**
 * 루트 레이아웃
 */
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ko" className="dark">
			<head>
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
				/>
			</head>
			<body className="bg-background text-foreground min-h-screen">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
