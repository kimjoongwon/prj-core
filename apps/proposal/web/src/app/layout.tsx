import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
	title: "온짓다 | AI 중심 외주 개발 스튜디오",
	description:
		"온짓다는 AI 주도로 기획, UI 시스템, 도메인 설계를 연결해 더 적은 handoff와 더 빠른 실행으로 제품을 만드는 개발 스튜디오입니다.",
};

const THEME_STORAGE_KEY = "heroui-theme";

const themeBootScript = `
(() => {
	try {
		const storageKey = "${THEME_STORAGE_KEY}";
		const storedTheme = window.localStorage.getItem(storageKey);
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const nextTheme =
			storedTheme === "light" || storedTheme === "dark"
				? storedTheme
				: prefersDark
					? "dark"
					: "light";
		const root = document.documentElement;

		root.classList.remove("light", "dark", "system");
		root.classList.add(nextTheme);
		root.style.colorScheme = nextTheme;
	} catch (_error) {
		document.documentElement.classList.remove("light", "dark", "system");
		document.documentElement.classList.add("light");
		document.documentElement.style.colorScheme = "light";
	}
})();
`;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko" suppressHydrationWarning>
			<head>
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
				/>
				<script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
			</head>
			<body className="min-h-screen bg-background text-foreground antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
