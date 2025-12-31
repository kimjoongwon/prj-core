import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "@cocrepo/ui";
import { Providers } from "./providers";

export const metadata: Metadata = {
	title: "Admin",
	description: "Admin Dashboard",
};

/**
 * 루트 레이아웃
 * AppLayout은 children만 받으며 순수하게 body를 감쌉니다.
 *
 * 계층 구조:
 * - AppLayout (app/layout.tsx) - children만, body 래퍼
 *     - PageLayout (app/(admin)/layout.tsx) - header, leftAside, rightAside, footer
 *         - SectionLayout (하위 layout.tsx들) - top, left, right, bottom
 */
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ko">
			<body>
				<Providers>
					<AppLayout>{children}</AppLayout>
				</Providers>
			</body>
		</html>
	);
}
