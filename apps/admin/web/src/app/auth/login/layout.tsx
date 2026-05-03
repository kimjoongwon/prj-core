import { Section } from "@cocrepo/ui";
import type { ReactNode } from "react";
import { AuthLoginActions } from "./AuthLoginActions";

/**
 * 로그인 페이지 레이아웃
 *
 * 계층 구조:
 * - App (app/layout.tsx)
 *     - Page (auth/layout.tsx)
 *         - Section (여기) - children만 (중앙 정렬)
 */
export default function LoginLayoutRoute({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<Section>
			<AuthLoginActions />
			<div className="flex min-h-screen items-center justify-center p-4 lg:p-8">
				<div className="w-full max-w-md">{children}</div>
			</div>
		</Section>
	);
}
