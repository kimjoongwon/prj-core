"use client";

import { SectionShell } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

/**
 * 로그인 페이지 레이아웃
 *
 * 계층 구조:
 * - AppShell (app/layout.tsx)
 *     - PageShell (auth/layout.tsx)
 *         - SectionShell (여기) - children만 (중앙 정렬)
 */
const LoginLayoutRoute = observer(function LoginLayoutRoute({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SectionShell>
			<div className="flex h-full items-center justify-center p-4 lg:p-8">
				<div className="w-full max-w-md">{children}</div>
			</div>
		</SectionShell>
	);
});

export default LoginLayoutRoute;
