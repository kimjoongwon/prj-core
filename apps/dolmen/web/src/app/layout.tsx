import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
	title: "Dolmen · MOMO 이력서 면접 Q&A",
	description:
		"면접관의 경력·프로젝트·기술·협업 질문에 MOMO가 등록된 이력서를 근거로 답합니다.",
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
