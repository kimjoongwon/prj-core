"use client";

import { Section } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

/**
 * 로그인 페이지 레이아웃
 *
 * 계층 구조:
 * - App (app/layout.tsx)
 *     - Page (auth/layout.tsx)
 *         - Section (여기) - children만 (중앙 정렬)
 */
const LoginLayoutRoute = observer(function LoginLayoutRoute({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Section>
			<div className="flex h-full items-center justify-center p-4 lg:p-8">
				<div className="w-full max-w-md">{children}</div>
			</div>
		</Section>
	);
});

export default LoginLayoutRoute;
