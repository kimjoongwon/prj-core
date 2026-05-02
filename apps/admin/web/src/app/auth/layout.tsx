import { Page } from "@cocrepo/ui";
import type { ReactNode } from "react";
import { AuthTopActions } from "./AuthTopActions";

/**
 * 인증 페이지 레이아웃
 * 로그인, 회원가입 등 인증 관련 페이지에 적용되는 레이아웃입니다.
 *
 * 계층 구조:
 * - App (app/layout.tsx)
 *     - Page (여기) - header/aside 없이 children만
 *         - Section (auth/login/layout.tsx 등)
 *
 * 규칙: 하나의 layout.tsx에는 하나의 Layout만 선언
 */
export default function AuthLayoutRoute({ children }: { children: ReactNode }) {
	return (
		<Page className="relative min-h-screen">
			<AuthTopActions />
			{children}
		</Page>
	);
}
