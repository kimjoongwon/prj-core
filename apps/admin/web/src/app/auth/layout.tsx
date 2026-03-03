"use client";

import { PageShell } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

/**
 * 인증 페이지 레이아웃
 * 로그인, 회원가입 등 인증 관련 페이지에 적용되는 레이아웃입니다.
 *
 * 계층 구조:
 * - AppShell (app/layout.tsx)
 *     - PageShell (여기) - header/aside 없이 children만
 *         - SectionShell (auth/login/layout.tsx 등)
 *
 * 규칙: 하나의 layout.tsx에는 하나의 Layout만 선언
 */
const AuthLayoutRoute = observer(function AuthLayoutRoute({
	children,
}: {
	children: React.ReactNode;
}) {
	return <PageShell>{children}</PageShell>;
});

export default AuthLayoutRoute;
