import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
	title: "Dolmen — 온보딩 위키 어시스턴트",
	description:
		"문서 검색(RAG)과 대화 기억을 갖춘 에이전트에게 온보딩 위키를 질문합니다.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ko" className="h-full antialiased" suppressHydrationWarning>
			<body className="min-h-full bg-background text-foreground">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
