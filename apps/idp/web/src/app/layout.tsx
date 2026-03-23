import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

const THEME_BOOTSTRAP_SCRIPT = `
(() => {
	try {
		const storageKey = "heroui-theme";
		const defaultTheme = "system";
		const storedTheme = window.localStorage.getItem(storageKey);
		const selectedTheme =
			storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
				? storedTheme
				: defaultTheme;
		const resolvedTheme =
			selectedTheme === "system"
				? window.matchMedia("(prefers-color-scheme: dark)").matches
					? "dark"
					: "light"
				: selectedTheme;
		const root = document.documentElement;
		root.classList.remove("light", "dark", "system");
		root.classList.add(resolvedTheme);
		root.style.colorScheme = resolvedTheme;
	} catch (error) {}
})();
`;

export const metadata: Metadata = {
	title: "플레이트 계정",
	description: "플레이트 예약 플랫폼 계정 및 인증 관리",
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
		<html lang="ko" suppressHydrationWarning>
			<head>
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
				/>
				<script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
			</head>
			<body className="bg-background text-foreground min-h-screen antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
