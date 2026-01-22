import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
	title: "제대로 만드는 사람들",
	description: "기획부터 배포까지, 빈틈없는 완성도",
};

/**
 * 루트 레이아웃
 * 정적 사이트용 간소화된 레이아웃
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
			<body className="bg-black text-foreground antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
