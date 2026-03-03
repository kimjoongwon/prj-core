"use client";

import { Page } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

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
function AuthLayoutRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Page className="min-h-screen">{children}</Page>;
}

export default AuthLayoutRoute;
