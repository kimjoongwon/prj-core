import type { ReactNode } from "react";
import { AuthLayoutShell } from "./AuthLayoutShell";

/**
 * 인증 플로우 레이아웃
 *
 * 공개 인증 플로우의 공통 바깥 레이아웃을 담당합니다.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
	return <AuthLayoutShell>{children}</AuthLayoutShell>;
}
