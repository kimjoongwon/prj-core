import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
	title: "라이브 커머스 데모 — 실시간 방송 쇼핑",
	description:
		"라이브 방송 시청, 실시간 채팅, 무중단 오버레이 결제, 관리자 대시보드를 시연하는 목업 데모입니다.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="ko"
			className="dark h-full antialiased"
			suppressHydrationWarning
		>
			<body className="min-h-full bg-zinc-950 text-zinc-100">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
