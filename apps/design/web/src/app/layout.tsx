import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "디자인 링크 아카이브",
	description:
		"디자인 감각을 기르기 위해 직접 접속 검증한 레퍼런스 모음 — 갤러리, SaaS 관리자 화면, 원리, 데이터 시각화, 국내 자료.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ko" className="h-full antialiased" suppressHydrationWarning>
			<body className="min-h-full bg-zinc-50 text-zinc-900">{children}</body>
		</html>
	);
}
